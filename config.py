import logging

########################################################################
#
#   General options

### Logging
log_level = logging.INFO
log_format = '%(asctime)s %(levelname)s %(name)s: %(message)s'

### Server
listening_ip = "127.0.0.1"
listening_port = 8080

### Cost Estimate
kwh_rate = 0.26  # Rate in currency_type to calculate cost to run job
currency_type = "EUR"  # Currency Symbol to show when calculating cost to run job

########################################################################
#
#   GPIO Setup (BCM SoC Numbering Schema)
#
#   Check the RasPi docs to see where these GPIOs are
#   connected on the P1 header for your board type/rev.
#   These were tested on a Pi B Rev2 but of course you
#   can use whichever GPIO you prefer/have available.

### Outputs
#gpio_heat = 12  # Switches zero-cross solid-state-relay
gpio_cool = 4  # Regulates PWM for 12V DC Blower
gpio_air = 24  # Switches 0-phase det. solid-state-relay


def get_gpio_sensor_data(channel):
    if channel == 1:
        return 26
    if channel == 2:
        return 20
    if channel == 3:
        return 22
    if channel == 4:
        return 28
    if channel == 5:
        return 27
    if channel == 6:
        return 25


def get_gpio_heat(channel):
    if channel == 1:
        return 12
    if channel == 2:
        return 16
    if channel == 3:
        return 14
    if channel == 4:
        return 18
    if channel == 5:
        return 11
    if channel == 6:
        return 13

heater_invert = 0  # switches the polarity of the heater control
Data_path=""
### Inputs
gpio_door = 6

### Thermocouple Adapter selection:
#   max31855 - bitbang SPI interface
#   max31855spi - kernel SPI interface
#   max6675 - bitbang SPI interface
max31855 = 0
max6675 = 1
max31855spi = 0  # if you use this one, you MUST reassign the default GPIO pins

### Thermocouple Connection (using bitbang interfaces)
gpio_sensor_cs = 13
gpio_sensor_clock = 19
#gpio_sensor_data = 24

### Thermocouple SPI Connection (using adafrut drivers + kernel SPI interface)
spi_sensor_chip_id = 0

### amount of time, in seconds, to wait between reads of the thermocouple
sensor_time_wait = .5

########################################################################
#
#   PID parameters

pid_ki = 0.1  # Integration
pid_kd = 0.4  # Derivative
pid_kp = 0.5  # Proportional

########################################################################
#
#   Simulation parameters

sim_t_env = 25.0  # deg C
sim_c_heat = 100.0  # J/K  heat capacity of heat element
sim_c_oven = 2000.0  # J/K  heat capacity of oven
sim_p_heat = 3500.0  # W    heating power of oven
sim_R_o_nocool = 1.0  # K/W  thermal resistance oven -> environment
sim_R_o_cool = 0.05  # K/W  " with cooling
sim_R_ho_noair = 0.1  # K/W  thermal resistance heat element -> oven
sim_R_ho_air = 0.05  # K/W  " with internal air circulation

########################################################################
#
#   Time and Temperature parameters

temp_scale = "c"  # c = Celsius | f = Fahrenheit - Unit to display
time_scale_slope = "s"  # s = Seconds | m = Minutes | h = Hours - Slope displayed in temp_scale per time_scale_slope
time_scale_profile = "s"  # s = Seconds | m = Minutes | h = Hours - Enter and view target time in time_scale_profile
