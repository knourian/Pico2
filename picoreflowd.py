#!/usr/bin/env python2

import os
import profile
import sys
import logging
import json

import bottle
import datetime
import gevent
import geventwebsocket
from gevent.pywsgi import WSGIServer
from geventwebsocket import WebSocketError
from geventwebsocket.handler import WebSocketHandler

try:
    sys.dont_write_bytecode = True
    import config

    sys.dont_write_bytecode = False
except:
    print("Could not import config file.")
    print("Copy config.py.EXAMPLE to config.py and adapt it for your setup.")
    exit(1)

logging.basicConfig(level=config.log_level, format=config.log_format)
log = logging.getLogger("picoreflowd")
log.info("Starting picoreflowd")

script_dir = os.path.dirname(os.path.realpath(__file__))
log.info("script_dir : " + script_dir)
sys.path.insert(0, script_dir + '/lib/')
profile_path = os.path.join(script_dir, "storage", "profile")

Data_path = os.path.join(script_dir, "storage", "Data")
config.Data_path = Data_path

from lib.oven import Oven, Profile

from lib.ovenWatcher import OvenWatcher

app = bottle.Bottle()
oven = Oven()
ovenWatcher = OvenWatcher(oven)


@app.route('/')
def index():
    return bottle.redirect('/picoreflow/indexnew.html')


@app.route('/picoreflow/:filename#.*#')
def send_static(filename):
    log.debug("serving %s" % filename)
    return bottle.static_file(filename, root=os.path.join(os.path.dirname(os.path.realpath(sys.argv[0])), "public"))


def get_websocket_from_request():
    env = bottle.request.environ
    wsock = env.get('wsgi.websocket')
    if not wsock:
        bottle.abort(400, 'Expected WebSocket request.')
    return wsock


@app.route('/control')
def handle_control():
    wsock = get_websocket_from_request()
    log.info("websocket (control) opened")
    while True:
        try:
            message = wsock.receive()
            log.info("Received (control): %s" % message)
            msgdict = json.loads(message)
            channelActived = []
            if msgdict.get("cmd") == "RUN":
                log.info("RUN command received")
                profile_obj = msgdict.get('profile')
                channel = 1
                simulateFlag = True
                if profile_obj:
                    if eval(((profile_obj['channel'][0]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][0]['profile'])
                        profile = Profile(profile_json)
                        channel = 1
                        channelActived.append(channel)
                        simulated_oven_1 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_1 = OvenWatcher(simulated_oven_1)
                        simulation_watcher_1.add_observer(wsock)
                        simulated_oven_1.run_profile(profile)
                        simulation_watcher_1.record(profile)
                    if eval(((profile_obj['channel'][1]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][1]['profile'])
                        profile = Profile(profile_json)
                        channel = 2
                        channelActived.append(channel)
                        simulated_oven_2 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_2 = OvenWatcher(simulated_oven_2)
                        simulation_watcher_2.add_observer(wsock)
                        simulated_oven_2.run_profile(profile)
                        simulation_watcher_2.record(profile)
                    if eval(((profile_obj['channel'][2]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][2]['profile'])
                        profile = Profile(profile_json)
                        channel = 3
                        channelActived.append(channel)
                        simulated_oven_3 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_3 = OvenWatcher(simulated_oven_3)
                        simulation_watcher_3.add_observer(wsock)
                        simulated_oven_3.run_profile(profile)
                        simulation_watcher_3.record(profile)
                    if eval(((profile_obj['channel'][3]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][3]['profile'])
                        profile = Profile(profile_json)
                        channel = 4
                        channelActived.append(channel)
                        simulated_oven_4 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_4 = OvenWatcher(simulated_oven_4)
                        simulation_watcher_4.add_observer(wsock)
                        simulated_oven_4.run_profile(profile)
                        simulation_watcher_4.record(profile)
                    if eval(((profile_obj['channel'][4]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][4]['profile'])
                        profile = Profile(profile_json)
                        channel = 5
                        channelActived.append(channel)
                        simulated_oven_5 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_5 = OvenWatcher(simulated_oven_5)
                        simulation_watcher_5.add_observer(wsock)
                        simulated_oven_5.run_profile(profile)
                        simulation_watcher_5.record(profile)
                    if eval(((profile_obj['channel'][5]['activated']) + "").capitalize()):
                        profile_json = json.dumps(profile_obj['channel'][5]['profile'])
                        profile = Profile(profile_json)
                        channel = 6
                        channelActived.append(channel)
                        simulated_oven_6 = Oven(channel, simulate=simulateFlag, time_step=0.5)
                        simulation_watcher_6 = OvenWatcher(simulated_oven_6)
                        simulation_watcher_6.add_observer(wsock)
                        simulated_oven_6.run_profile(profile)
                        simulation_watcher_6.record(profile)
            elif msgdict.get("cmd") == "STOP":
                log.info("Stop command received")
                try:
                    simulated_oven_1.abort_run()
                    simulated_oven_2.abort_run()
                    simulated_oven_3.abort_run()
                    simulated_oven_4.abort_run()
                    simulated_oven_5.abort_run()
                    simulated_oven_6.abort_run()
                except NameError as e:
                    log.info(e)
                clearFiles();
        except WebSocketError:
            break
    log.info("websocket (control) closed")


@app.route('/storage')
def handle_storage():
    wsock = get_websocket_from_request()
    log.info("websocket (storage) opened")
    while True:
        try:
            message = wsock.receive()
            if not message:
                break
            log.debug("websocket (storage) received: %s" % message)

            try:
                msgdict = json.loads(message)
            except:
                msgdict = {}

            if message == "GET":
                log.info("GET command recived")
                wsock.send(get_profiles())
            elif msgdict.get("cmd") == "DELETE":
                log.info("DELETE command received")
                profile_obj = msgdict.get('profile')
                if delete_profile(profile_obj):
                    msgdict["resp"] = "OK"
                wsock.send(json.dumps(msgdict))
                # wsock.send(get_profiles())
            elif msgdict.get("cmd") == "PUT":
                log.info("PUT command received")
                profile_obj = msgdict.get('profile')
                force = msgdict.get('force', False)
                if profile_obj:
                    # del msgdict["cmd"]
                    if save_profile(profile_obj, force):
                        msgdict["resp"] = "OK"
                    else:
                        msgdict["resp"] = "FAIL"
                    log.debug("websocket (storage) sent: %s" % message)
                    wsock.send(json.dumps(msgdict))
                    wsock.send(get_profiles())
            elif msgdict.get("cmd") == "SAVE":
                log.info("SAVE command received")
                profile_obj = msgdict.get('channels')
                if profile_obj:
                    if save_channel(profile_obj, True):
                        msgdict["resp"] = "OK"
                    else:
                        msgdict["resp"] = "FAIL"
                    log.debug("websocket (storage) sent: %s" % message)
                    wsock.send(json.dumps(msgdict))
                    wsock.send(get_channel())
            elif message == "GETCH":
                log.info("GETCH command recived")
                wsock.send(get_channel())
        except WebSocketError:
            break
    log.info("websocket (storage) closed")


@app.route('/config')
def handle_config():
    wsock = get_websocket_from_request()
    log.info("websocket (config) opened")
    while True:
        try:
            message = wsock.receive()
            if not message:
                break
            log.debug("websocket (storage) received: %s" % message)
            try:
                msgdict = json.loads(message)
            except:
                msgdict = {}
            wsock.send(get_config())
        except WebSocketError:
            break
    log.info("websocket (config) closed")


@app.route('/status')
def handle_status():
    wsock = get_websocket_from_request()
    ovenWatcher.add_observer(wsock)
    log.info("websocket (status) opened")
    while True:
        try:
            message = wsock.receive()
            wsock.send("Your message was: %r" % message)
        except WebSocketError:
            break
    log.info("websocket (status) closed")


import re

pattern = re.compile("^[1-6].csv")


def clearFiles():
    try:
        DataFiles = os.listdir(Data_path)
    except:
        DataFiles = []
    for filename in DataFiles:
        if pattern.match(filename):
            newname = os.path.join(Data_path,
                                   "%s_%s.csv" % (filename[0:1], datetime.datetime.now().strftime("%Y_%m_%d%H%M%S")))
            filename = os.path.join(Data_path, filename)
            os.rename(filename, newname)
            # with open(os.path.join(Data_path, filename), 'w+') as f:
            #     f.close()


def get_profiles():
    try:
        profile_files = os.listdir(profile_path)
    except:
        profile_files = []
    profiles = []
    for filename in profile_files:
        with open(os.path.join(profile_path, filename), 'r') as f:
            profiles.append(json.load(f))

    return json.dumps(profiles)


def get_channel():
    try:
        Channel_path = os.path.join(script_dir, "public");
        Channel_file = os.listdir(Channel_path)
    except:
        Channel_file = []
    channels = []
    for filename in Channel_file:
        if filename == "channel.json":
            with open(os.path.join(Channel_path, filename), 'r') as f:
                channels = json.load(f)

    return json.dumps(channels)


def save_profile(profile, force=False):
    profile_json = json.dumps(profile)
    filename = profile['name'] + ".json"
    filepath = os.path.join(profile_path, filename)
    if not force and os.path.exists(filepath):
        log.error("Could not write, %s already exists" % filepath)
        return False
    with open(filepath, 'w+') as f:
        f.write(profile_json)
        f.close()
    log.info("Wrote %s" % filepath)
    return True


def save_channel(channel, force=False):
    profile_json = json.dumps(channel)
    filename = "channel" + ".json"
    filepath = os.path.join(script_dir, "public", filename)
    if not force and os.path.exists(filepath):
        log.error("Could not write, %s already exists" % filepath)
        return False
    with open(filepath, 'w+') as f:
        f.write(profile_json)
        f.close()
    log.info("Wrote %s" % filepath)
    return True


def delete_profile(profile):
    profile_json = json.dumps(profile)
    filename = profile['name'] + ".json"
    filepath = os.path.join(profile_path, filename)
    os.remove(filepath)
    log.info("Deleted %s" % filepath)
    return True


def get_config():
    return json.dumps({"temp_scale": config.temp_scale,
                       "time_scale_slope": config.time_scale_slope,
                       "time_scale_profile": config.time_scale_profile,
                       "kwh_rate": config.kwh_rate,
                       "currency_type": config.currency_type})


def main():
    ip = config.listening_ip
    port = config.listening_port
    log.info("listening on %s:%d" % (ip, port))

    server = WSGIServer((ip, port), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
