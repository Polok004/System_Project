import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [value, setValue] = useState(""); // For description
  const [images, setImages] = useState([]); // For images
  const [error, setError] = useState(""); // For errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const postData = res.data;
        setPost(postData);
        setValue(postData.postDetail.desc);
        setImages(postData.images);
      } catch (err) {
        console.error(err);
        setError("Failed to load post data");
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteImage = (indexToDelete) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
  
    try {
      await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate(`/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update post");
    }
  };
  
  if (!post) return <div>Loading...</div>;

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {/* Dynamic Input Fields */}
            {[
              { label: "Title", name: "title", type: "text", defaultValue: post.title },
              { label: "Price", name: "price", type: "number", defaultValue: post.price },
              { label: "Address", name: "address", type: "text", defaultValue: post.address },
              { label: "City", name: "city", type: "text", defaultValue: post.city },
              { label: "Bedroom Number", name: "bedroom", type: "number", defaultValue: post.bedroom },
              { label: "Bathroom Number", name: "bathroom", type: "number", defaultValue: post.bathroom },
              { label: "Latitude", name: "latitude", type: "text", defaultValue: post.latitude },
              { label: "Longitude", name: "longitude", type: "text", defaultValue: post.longitude },
            ].map((input, index) => (
              <div key={index} className="item">
                <label htmlFor={input.name}>{input.label}</label>
                <input id={input.name} name={input.name} type={input.type} defaultValue={input.defaultValue} />
              </div>
            ))}

            {/* Dropdown Fields */}
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" defaultValue={post.type}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" defaultValue={post.property}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" defaultValue={post.postDetail.utilities}>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" defaultValue={post.postDetail.pet}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>

            {/* Numeric Inputs */}
            {[
              { label: "Income Policy", name: "income", type: "text", defaultValue: post.postDetail.income },
              { label: "Total Size (sqft)", name: "size", type: "number", defaultValue: post.postDetail.size },
              { label: "School", name: "school", type: "number", defaultValue: post.postDetail.school },
              { label: "Bus", name: "bus", type: "number", defaultValue: post.postDetail.bus },
              { label: "Restaurant", name: "restaurant", type: "number", defaultValue: post.postDetail.restaurant },
            ].map((input, index) => (
              <div key={index} className="item">
                <label htmlFor={input.name}>{input.label}</label>
                <input
                  id={input.name}
                  name={input.name}
                  type={input.type}
                  defaultValue={input.defaultValue}
                  min={input.type === "number" ? 0 : undefined}
                />
              </div>
            ))}

            {/* Description */}
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>

            {/* Submit Button */}
            <button className="sendButton">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>

      {/* Side Container for Images */}
      <div className="sideContainer">
        {images.map((image, index) => (
          <div key={index} className="imageWrapper">
            <img src={image} alt={`Preview ${index}`} />
            <button onClick={() => handleDeleteImage(index)} className="deleteButton">
              Delete
            </button>
          </div>
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "polok2000",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default EditPostPage;