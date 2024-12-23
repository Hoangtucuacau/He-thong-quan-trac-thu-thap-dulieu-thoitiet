import smbus
import time

bus_number = 1

max44009_address = 0x4A
bmp180_address = 0x77

bus = smbus.SMBus(bus_number)

def read_max44009():
    bus.write_byte(max44009_address, 0x03)
    time.sleep(0.1)
    data = bus.read_i2c_block_data(max44009_address, 0x03, 2)
    exponent = (data[0] & 0xF0) >> 4
    mantissa = ((data[0] & 0x0F) << 4) | (data[1] & 0x0F)
    luminosity = ((2 ** exponent) * mantissa) * 0.045
    return luminosity

def read_bmp180():
    bus.write_byte_data(bmp180_address, 0xF4, 0x2E)
    time.sleep(0.005)
    msb = bus.read_byte_data(bmp180_address, 0xF6)
    lsb = bus.read_byte_data(bmp180_address, 0xF7)
    xlsb = bus.read_byte_data(bmp180_address, 0xF8)
    uncomp_pressure = ((msb << 16) | (lsb << 8) | xlsb) >> (8 - 0)
    compensated_pressure = uncomp_pressure * 0.01
    return compensated_pressure

try:
    while True:
        max44009_data = read_max44009()
        bmp180_data = read_bmp180()
        print("MAX44009 Luminosity: {:.2f} lux".format(max44009_data))
        print("BMP180 Pressure: {:.2f} Pa".format(bmp180_data))
        time.sleep(1)
except KeyboardInterrupt:
    print("Exiting program.")
