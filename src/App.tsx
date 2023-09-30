import { useEffect, useState } from "react";
import "./App.css";
import Webcam from "react-webcam";

type Resolution = {
  width: ConstrainULong | undefined;
  height: ConstrainULong | undefined;
  label: string;
};

const resolutions = [
  { width: undefined, height: undefined, label: "Default" },
  { width: 320, height: 240, label: "320x240" },
  { width: 640, height: 360, label: "640x360" },
  { width: 1280, height: 720, label: "1280x720 (HD)" },
  { width: 1920, height: 1080, label: "1920x1080 (Full HD)" },
  { width: 2560, height: 1440, label: "2560x1440 (QHD)" },
  { width: 3840, height: 2160, label: "3840x2160 (4K)" },
];

function App() {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");

  const [resolution, setResolution] = useState<Resolution>(resolutions[0]);
  const [customResolution, setCustomResolution] = useState<boolean>();
  const [mirrored, setMirrored] = useState<boolean>(false);

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");

  function fetchDevices() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setVideoDevices(videoDevices);
        setAudioDevices(audioDevices);
      });
  }

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <>
      <div className="container">
        <div className="webcam">
          <Webcam
            audio={true}
            videoConstraints={{
              deviceId: selectedVideoDevice,
              width: resolution.width,
              height: resolution.height,
            }}
            audioConstraints={{ deviceId: selectedAudioDevice }}
            mirrored={mirrored}
            controls
          />
        </div>
        <div className="controls">
          <h1>Webcam Controls</h1>
          <div>
            <h2>Video</h2>
            <label htmlFor="video-device-control">Video Device:</label>
            <select
              id="video-device-control"
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
              value={selectedVideoDevice}
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>

            <h3>Resolution</h3>
            <div className="label-input">
              <label htmlFor="custom-resolution-control">Custom:</label>
              <input
                type="checkbox"
                id="custom-resolution-control"
                name="custom-resolution-control"
                checked={customResolution}
                onChange={(e) => {
                  setCustomResolution(e.target.checked);
                  if (!e.target.checked) {
                    setResolution(resolutions[0]);
                  }
                }}
              />
            </div>
            {customResolution ? (
              <>
                <div className="label-input">
                  <label htmlFor="width-control">Width:</label>
                  <input
                    type="number"
                    id="width-control"
                    className="resolution-text-input"
                    name="width-control"
                    value={resolution.width?.toString()}
                    onChange={(e) =>
                      setResolution((value) => ({
                        ...value,
                        width: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="label-input">
                  <label htmlFor="height-control">Height:</label>
                  <input
                    type="number"
                    id="height-control"
                    className="resolution-text-input"
                    name="height-control"
                    value={resolution.height?.toString()}
                    onChange={(e) =>
                      setResolution({
                        ...resolution,
                        height: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            ) : (
              <div className="label-input">
                <select
                  onChange={(e) =>
                    setResolution(
                      resolutions.find((res) => res.label === e.target.value)!
                    )
                  }
                  value={resolution.label}
                >
                  {resolutions.map((res) => (
                    <option key={res.label} value={res.label}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="label-input">
              <label htmlFor="mirrored-control">Mirrored:</label>
              <input
                type="checkbox"
                id="mirrored-control"
                name="mirrored-control"
                checked={mirrored}
                onChange={(e) => setMirrored(e.target.checked)}
              />
            </div>
          </div>

          <div>
            <h2>Audio</h2>
            <div className="label-input">
              <label htmlFor="audio-device-control">Audio Device:</label>
              <select
                id="audio-device-control"
                onChange={(e) => setSelectedAudioDevice(e.target.value)}
                value={selectedAudioDevice}
              >
                {audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button onClick={fetchDevices}>Update</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
