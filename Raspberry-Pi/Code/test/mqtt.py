import RPi.GPIO as GPIO
import time
import ssl
import paho.mqtt.client as paho
import paho.mqtt.publish as publish
from paho import mqtt
import dht11

GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)

instance = dht11.DHT11(pin=4)

mqtt_host = "mqttvcloud.innoway.vn"
mqtt_port = 1883
mqtt_username = "abc"
mqtt_password = "jp4jfwJHNXaql5gJ9xZzF8PNJm7oZ2ND"
mqtt_topic = "sensor_data"

mqtt_client = paho.Client()
mqtt_client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
mqtt_client.username_pw_set(mqtt_username, mqtt_password)
mqtt_client.connect(mqtt_host, mqtt_port)

while True:
    try:
        result = instance.read()
        if result.is_valid():
            temperature = result.temperature
            humidity = result.humidity
            lux = 50 
            pressure = 60  

            if temperature is not None and humidity is not None and lux is not None and pressure is not None:
                payload = f'{{"temperature": {temperature}, "humidity": {humidity}, "lux": {lux}, "pressure": {pressure}}}'
                mqtt_client.publish(mqtt_topic, payload)
                print(f"Data has been sent to the MQTT Broker: {payload}")

            time.sleep(5)

    except KeyboardInterrupt:
        print("Cleanup")
        GPIO.cleanup()
        break