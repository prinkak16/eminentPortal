import React from "react";
import ImageUploading from "react-images-uploading";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './imageupload.scss'

let theme = createTheme({
    shape: {
        pillRadius: 50,
        background:'red',
    }
});
const UploadImage=()=>{
    const [images, setImages] = React.useState([]);
    const maxNumber = 69;
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };
    return (
        <div className="imgupload">
            <ImageUploading
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={["png", "jpg"]}
            >
                {({
                      imageList,
                      onImageUpload,
                      isDragging,
                      dragProps
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        <div className="Imagewrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="121" height="133" viewBox="0 0 121 133" fill="none">
                                <path d="M30.6875 31.9582C30.6875 49.1185 44.0634 63.0832 60.5 63.0832C76.9366 63.0832 90.3125 49.1185 90.3125 31.9582C90.3125 14.798 76.9366 0.833252 60.5 0.833252C44.0634 0.833252 30.6875 14.798 30.6875 31.9582ZM113.5 132.25H120.125V125.333C120.125 98.6418 99.3159 76.9166 73.75 76.9166H47.25C21.6775 76.9166 0.875 98.6418 0.875 125.333V132.25H113.5Z" fill="#699BF7"/>
                            </svg>
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={image.data_url} alt=""  />
                                </div>
                            ))}
                        </div>
                        &nbsp;
                        <ThemeProvider theme={theme}>
                            <Button className="uploadbtn" variant="outlined" startIcon={<PhotoCameraIcon />}
                                    style={isDragging ? { color: "#FF9559", background:"#FFE8DB", borderRadius: "4.714px" } : null}
                                    onClick={onImageUpload}
                                    {...dragProps}
                            >
                                Add Photo
                            </Button>
                        </ThemeProvider>
                    </div>
                )}
            </ImageUploading>
        </div>
    );
}
export default UploadImage
