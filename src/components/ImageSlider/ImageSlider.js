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
  const [filtered, setFiltered] = useState();
  const [fromTime, setFromTime] = useState("02:00");
  const [toTime, setToTime] = useState();
  const [dropdown, setDropdown] = useState(false);
  const [id, setId] = useState(5);
  const [playback, setPlayback] = useState(300);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayDate);
  const [data, setData] = useState();
  useEffect(() => {
    setLoading(false);
    console.log("Fetching");
    const fetchData = async () => {
      try {
        const response = await axios.request(
          `https://jobmanager.in/react-api.php?current_date=${date}&uid=${id}`
        );
        const jsonData = await response.data;
        if (jsonData) {
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
            // console.log(datetimeObj.toFormat("hh:mm a"));
            return datetimeObj.toFormat("HH:mm");
            // const hours = datetimeObj.toFormat("HH");
            // const minutes = datetimeObj.toFormat("mm");
            // const seconds = datetimeObj.toFormat("ss");
            // const amPm = hours >= 12 ? "PM" : "AM";
            // // const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            // return `${hours}:${minutes} ${seconds}`;
          };

          const extractedTimes = galleryImages.map((item) =>
            getTimeFromDatetime(item.time)
          );
          // const startTime = DateTime.local().toFormat('hh:mm a')
          const formatTime = (time) => {
            const [hour, minute, period] = time.split(" ");
            const [hourNumber, minuteNumber] = hour.split(":");
            let formattedHour = parseInt(hourNumber, 10);
            console.log(period);
            console.log(period);

            // Adjust the hour for PM times
            if (period === "PM" && formattedHour !== 12) {
              formattedHour += 12;
            }

            // Adjust the hour for AM times with hour 12
            if (period === "AM" && formattedHour === 12) {
              formattedHour = 0;
            }

            // Pad single-digit hours and minutes with leading zeros
            const formattedHourString = formattedHour
              .toString()
              .padStart(2, "0");
            console.log(formattedHourString);
            const formattedMinuteString = minuteNumber
              .toString()
              .padStart(2, "0");
            console.log(formattedMinuteString);
            return `${formattedHourString}:${formattedMinuteString}`;
          };

          console.log(extractedTimes[0]);
          setFromTime(extractedTimes[0]);
          setToTime(extractedTimes[extractedTimes.length - 1]);
          // console.log(extractedTimes);

          // console.log(data);
          setLoading(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      console.log(fromTime);
      console.log(toTime);
    };

    fetchData();
  }, [date, id]);
  const handleDateChange = (event) => {
    setDate(event.target.value);
    console.log(date);
  };
  const handleDropdown = () => {
    setDropdown(true);
    console.debug(dropdown);
  };
  const hideDropdown = () => {
    setDropdown(false);
  };
  const filteringImages = () => {
    const filteredData = filtered.filter((image) => {
      if (fromTime && toTime) {
        // const selectedStart = DateTime.fromFormat(fromTime, "hh:mm");
        // console.log(selectedStart);
        // const selectedEnd = DateTime.fromFormat(toTime, "hh:mm");
        // console.log(selectedEnd);
        const imageTime = DateTime.fromFormat(image.time, "hh:mm");
        console.log(imageTime);

        return imageTime >= fromTime && imageTime <= toTime;
      }
    });

    setFiltered(filteredData);
    console.log(filteredData);
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

  // const fetchFilteredImages = async () => {
  //   // if (fromTime && toTime) {
  //   const url = "https://jobmanager.in/react-api.php";
  //   const body = {
  //     from_date: `${date} ${fromTime}`,
  //     to_date: `${date} ${toTime}`,
  //     uid: id,
  //   };
  //   console.log(body);
  //   const requestMetadata = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   };

  //   const response = await fetch(url, requestMetadata);
  //   // const FilteredData = await response.json();
  //   console.log(response);
  //   // }
  // };

  return (
    <div>
      <div className="time_container">
        <div>
          <label htmlFor="From_time">From</label>
          <input
            min="6:00"
            max="24:00"
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
        <div>{/* <button onClick={filteringImages}>Filter</button> */}</div>
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
      </div>
      <div className="image_gallery_Container">
        {loading ? (
          <ImageGallery
            items={data}
            slideInterval={playback}
            slideDuration={playback}
            autoPlay
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
                    <ul
                      className="dropdown_container"
                      onMouseLeave={hideDropdown}
                    >
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
      {/* <div className="controls_container">
        <SkipPreviousIcon style={{ color: "white" }} />
        {isPlaying ? (
          <PauseIcon style={{ color: "white" }} onClick={handlePlayPause} />
        ) : (
          <PlayArrowIcon style={{ color: "white" }} onClick={handlePlayPause} />
        )}
        <SkipNextIcon style={{ color: "white" }} />
      </div> */}
    </div>
  );
};

export default ImageSlider;
