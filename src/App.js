import {useState} from "react";

function App() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [phoneSize, setPhoneSize] = useState("");
  const [crop, setCrop] = useState(false);

  const surpriseOptions = [
    'flower fields in the mountain range',
    'beautiful turquoise lakes in alberta',
    'vacation in the tropics',
    'piano in front of a big window overlooking a garden',
    'pink sunsets in the bahamas',
    'night cityscape in shanghai during sunrise',
    'camping with the starry skies'
  ]

  const phoneSizeOptions = [
    '9:19.5',
    '9:16',
    '3:4',
    '16:23',
    '16:10',
    '16:9',
  ]

  const surpriseMe = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  const getImages = async () => {
    setImages(null);

    if (value === "") {
      setError("Please enter a non-empty prompt");
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-type": "application/json"
        }
      }
      const response = await fetch('http://localhost:8000/images', options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  }

  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "wallpaper.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSizeSelect = (size) => {
    setPhoneSize(size);
    setCrop(false);
  };

  const handleCrop = () => {
    setCrop(true);
  };

  const getCropStyle = (size) => {
    switch(size) {
      case '9:19.5':
        return { width: '18rem', height: '39rem', objectFit: 'cover' };
      case '9:16':
        return { width: '18rem', height: '32rem', objectFit: 'cover' };
      case '3:4':
        return { width: '18rem', height: '24rem', objectFit: 'cover' };
      case '16:23':
        return { width: '32rem', height: '46rem', objectFit: 'cover' };
      case '16:10':
        return { width: '32rem', height: '20rem', objectFit: 'cover' };
      case '16:9':
        return { width: '32rem', height: '18rem', objectFit: 'cover' };
      default:
        return {};
    }
  };

  return (
    <div className="app">

      <div className="title-section">
        <h1>WALL-Y</h1>
        <h3>envision, execute, and enjoy your wallpaper ideas</h3>
      </div>

      <section className="search-section">
        <div className="input-container">
          <input 
            placeholder="start generating your wallpaper prompt here..."
            onChange={e => setValue(e.target.value)}
            value={value}></input>
          <button
            onClick={getImages}>GENERATE
          </button>
        </div>
        <p>Want some prompt inspiration? 
          <span 
            className="surprise"
            onClick={surpriseMe}>GIVE ME INSPO</span>
        </p>

        {error && <p>{error}</p>}
      </section>

      {images != null && <div className="size-filter">
          <p>PREVIEW RATIOS:</p>
          {phoneSizeOptions.map(size => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              style={{
                backgroundColor: phoneSize === size ? 'black' : 'white', 
                color: phoneSize === size ? 'white' : 'black',
                border: '1px black solid'
              }}>
                {size}
            </button>
          ))}
          {phoneSize && (
          <button className="confirm-button" onClick={handleCrop}>
            Confirm
          </button>
        )}
      </div>}

      <section className="image-section">
        {images?.map((image, _index) => (
          <div className="image-container" key={_index}>
            <img 
              src={image.url} 
              alt={`Generated image of ${value}`} 
              style={crop ? getCropStyle(phoneSize) : {}}/>
            <button
              className="download-button"
              onClick={() => downloadImage(image.url)}>
              Download
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
