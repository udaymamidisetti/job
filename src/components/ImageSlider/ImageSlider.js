import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { DateTime } from "luxon";
import axios from "axios";
import "./ImageSlider.css";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SettingsIcon from "@mui/icons-material/Settings";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Input } from "@mui/material";
import { ClipLoader } from "react-spinners";
const ImageSlider = () => {
  let todayDate = DateTime.now().toFormat("yyyy-MM-dd");
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [dropdown, setDropdown] = useState(false);
  const [id, setId] = useState(5);
  const [playback, setPlayback] = useState(300);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayDate);
  const [data, setData] = useState();
  const [filtered, setFiltered] = useState(data);
  useEffect(() => {
    setLoading(false);
    const fetchData = async () => {
      try {
        const response = await axios.request(
          `https://jobmanager.in/react-api.php?current_date=${date}&uid=${id}`
        );
        const jsonData = await response.data;
        if (typeof jsonData === "object") {
          const updatedArray = Object.keys(jsonData).map((key) => {
            const updatedDateTime = updatedDate(jsonData[key].date_info);
            const updatedScreenshot = updatedScreenshotValue(
              jsonData[key].screenshot
            );
            return {
              screenshot: updatedScreenshot,
              date_info: updatedDateTime,
            };
          });
          function updatedScreenshotValue(screenshot) {
            return "data:image/png;base64," + screenshot;
          }
          function updatedDate(date_info) {
            return date_info;
          }
          const galleryImages = updatedArray.map((image) => ({
            original: image.screenshot,
            time: image.date_info,
          }));
          setData(galleryImages);
          setFiltered(galleryImages);

          const getTimeFromDatetime = (datetime) => {
            const datetimeObj = DateTime.fromFormat(
              datetime,
              "MMMM dd, yyyy hh:mm:ss a"
            );
            return datetimeObj.toFormat("HH:mm");
          };
          const extractedTimes = galleryImages.map((item) =>
            getTimeFromDatetime(item.time)
          );
          setFromTime(extractedTimes[0]);
          setToTime(extractedTimes[extractedTimes.length - 1]);
          setLoading(true);
        } else if (typeof jsonData === "string") {
          setData(jsonData);
          setLoading(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [date, id]);
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handleDropdown = () => {
    setDropdown(true);
  };
  const hideDropdown = () => {
    setDropdown(false);
  };
  const filteringImages = () => {
    if (typeof data === "object") {
      const filteredData = data.filter((image) => {
        if (fromTime && toTime) {
          const imageTime = DateTime.fromFormat(
            image.time,
            "MMMM dd, yyyy hh:mm:ss a"
          );
          const ImageTime = imageTime.toFormat("HH:mm");
          return ImageTime >= fromTime && ImageTime <= toTime;
        }
      });
      setFiltered(filteredData);
    } else {
      return null;
    }
  };
  const renderItem = (item) => {
    return (
      <div className="image-gallery-image">
        <img src={item.original} alt="" className="image-gallery" />
        <div className="timestamp-overlay">{item.time}</div>
      </div>
    );
  };
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying);
  };
  const handlePause = () => {
    setIsPlaying(true);
  };
  const handlePlay = () => {
    setIsPlaying(false);
  };

  const renderRecords = () => {
    return typeof data === "object" ? (
      <ImageGallery
        items={filtered}
        slideInterval={playback}
        slideDuration={playback}
        autoPlay={false}
        renderItem={renderItem}
        showIndex
        showNav={isPlaying}
        // showPlayButton={false}
        onPlay={handlePlay}
        onPause={handlePause}
        lazyLoad
        renderCustomControls={() => {
          return (
            <div>
              {dropdown ? (
                <ul className="dropdown_container" onMouseLeave={hideDropdown}>
                  <li onClick={() => setPlayback(100)}>2X</li>
                  <li onClick={() => setPlayback(200)}>1X</li>
                  <li onClick={() => setPlayback(300)}>0</li>
                  <li onClick={() => setPlayback(4000)}>0.1X</li>
                  <li onClick={() => setPlayback(5000)}>0.2X</li>
                </ul>
              ) : null}
              <SettingsIcon
                style={{ height: "33px", width: "33px", color: "white" }}
                className="settings_icon"
                // onClick={handleDropdown}
                onMouseEnter={handleDropdown}
              />
            </div>
          );
        }}
      />
    ) : (
      <div className="record-container">
        <h1 className="no-record">{data}</h1>
      </div>
    );
  };
  return (
    <div>
      <div className="time_container">
        <div>
          <label htmlFor="From_time">From</label>
          <input
            type="time"
            id="From_time"
            className="time_inputs"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="To_time">To</label>
          <input
            type="time"
            id="To_time"
            className="time_inputs"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="Enter Date"
          />
        </div>
        <div className="select-container">
          <input onChange={(e) => setId(e.target.value)} value={id} />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            style={{
              backgroundColor: "#F19828",
              paddingLeft: "10px",
              borderWidth: "0px",
              borderRadius: "3px",
              color: "white",
              height: "30px",
              fontWeight: "400",
              width: "70px",
              cursor: "pointer",
            }}
            onClick={filteringImages}
          >
            Filter
          </button>
        </div>
      </div>
      <div className="image_gallery_Container">
        {loading ? (
          renderRecords()
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <ClipLoader color="#F19828" size={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
