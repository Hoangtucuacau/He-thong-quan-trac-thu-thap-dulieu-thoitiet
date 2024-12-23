import time
import board
import adafruit_dht
import bmp180
import smbus
import max44009
from rpi_lcd import LCD
import RPi.GPIO as GPIO

import ssl
import paho.mqtt.client as paho
import paho.mqtt.publish as publish
from paho import mqtt

bus_number = 1
bus = smbus.SMBus(bus_number)
dht_pin = board.D17
dhtDevice = adafruit_dht.DHT11(dht_pin)
max44009_address = 0x4A
i2c = board.I2C()
bmp = bmp180.BMP180(i2c)
bmp.sea_level_pressure = 1019.44

max_sensor = max44009.MAX44009(1, 0x4a)
max_sensor.configure(cont=0, manual=0, cdr=0, timer=0)

GPIO.setmode(GPIO.BCM)
relaytem_pin = 23
relaylux_pin = 24
GPIO.setup(relaytem_pin, GPIO.OUT)
GPIO.setup(relaylux_pin, GPIO.OUT)
GPIO.output(relaytem_pin, GPIO.HIGH)
GPIO.output(relaylux_pin, GPIO.HIGH)

mqtt_host = "127.0.0.1"
mqtt_port = 1883
mqtt_username = ""
mqtt_password = ""
mqtt_topic = "sensor"

mqtt_client = paho.Client()
mqtt_client.connect(mqtt_host, mqtt_port)

lcd = LCD()
lcd.clear()


def on_message(client, userdata, message):
    if message.topic == "relaytem" and message.payload.decode() == "1":
        GPIO.output(relaytem_pin, GPIO.LOW)
        print("Relay dieu khien nhiet do da bat.")
    elif message.topic == "relaytem" and message.payload.decode() == "0":
        GPIO.output(relaytem_pin, GPIO.HIGH)
        print("Relay dieu khien nhiet do da tat.")
    elif message.topic == "relaylux" and message.payload.decode() == "1":
        GPIO.output(relaylux_pin, GPIO.LOW)
        print("Relay dieu khien anh sang da bat.")
    elif message.topic == "relaylux" and message.payload.decode() == "0":
        GPIO.output(relaylux_pin, GPIO.HIGH)
        print("Relay dieu khien anh sang da tat.")


def main():
    mqtt_client.on_message = on_message
    mqtt_client.subscribe("relaytem")
    mqtt_client.subscribe("relaylux")
    mqtt_client.loop_start()

    while True:
        try:
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity

            if temperature_c is not None and humidity is not None:
                temperature_c = round(temperature_c, 2)
                humidity = round(humidity, 2)

                lux = round(max_sensor.luminosity(), 2)

                hPa = bmp.pressure
                pressure = round(hPa * 0.75006375541921, 2)

                print(f"Temperature: {temperature_c} C, Humidity: {
                    humidity} %, Lux: {lux}, Pressure: {pressure} mmHg")

                payload = f'{{"temperature": {temperature_c}, "humidity": {
                    humidity}, "lux": {lux}, "pressure": {pressure}}}'
                mqtt_client.publish(mqtt_topic, payload)
                print(f"Data has been sent to the MQTT Broker: {payload}")

                lcd.clear()

                lcd.text(f"T:{temperature_c} H:{humidity}", 1)
                lcd.text(f"L:{lux} P:{pressure}", 2)

                time.sleep(5)

        except KeyboardInterrupt:
            print("Cleanup")
            break

        except Exception as e:
            print(f"An error occurred: {e}")

    GPIO.cleanup()


if __name__ == "__main__":
    main()
