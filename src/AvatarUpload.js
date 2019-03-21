import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Image as SemanticImage } from 'semantic-ui-react';

const DumpAvatarUpload = ({
  imgUrl = '',
  onUploadFile = file => {},
  onLimitError = (errorTexts = []) => {},
  imageMaxPxLimitNumber = 300,
  fileSizeLimitMb = 3,
}) => {
  const [isEnteringImage, setIsEnteringImage] = useState(false);
  return (
    <React.Fragment>
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => {
          setIsEnteringImage(true);
        }}
        onMouseLeave={() => {
          setIsEnteringImage(false);
        }}
      >
        <SemanticImage
          src={imgUrl}
          onError={e => {
            e.target.src = 'images/user.png';
          }}
          size={'small'}
          circular
          rounded
          style={{
            margin: '0 auto',
            width: '150px',
            minWidth: '150px',
            maxWidth: '150px',
          }}
        />
        {
          <label
            htmlFor="fileselect"
            style={{
              color: 'white',
              cursor: 'pointer',
              display: isEnteringImage ? 'block' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.3)',
                height: '50%',
                width: '100%',
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={'camera retro'} size={'small'} />
              Upload File
            </div>
          </label>
        }
      </div>
      <input
        accept="image/*"
        type="file"
        style={{ display: 'none' }}
        id="fileselect"
        onChange={e => {
          /**
           * Image Height and Width detect
           * https://stackoverflow.com/a/8904008/6414615
           */
          const { files = [] } = e.target;
          const newFile = files[0] || null;
          if (newFile) {
            if (newFile.size > fileSizeLimitMb * 1024 * 1024) {
              return onLimitError([
                `Over file size limit ${fileSizeLimitMb}MB`,
              ]);
            }
            const img = new Image();
            const _URL = window.URL || window.webkitURL;
            img.src = _URL.createObjectURL(newFile);
            img.onload = function() {
              if (
                this.width <= imageMaxPxLimitNumber &&
                this.height <= imageMaxPxLimitNumber
              ) {
                onUploadFile(newFile);
              } else {
                onLimitError([
                  `${
                    this.width > imageMaxPxLimitNumber
                      ? `Image width ${this.width} is over limit.`
                      : ''
                  } ${
                    this.height > imageMaxPxLimitNumber
                      ? `Image height ${this.height} is over limit`
                      : ''
                  }`,
                ]);
              }
            };
          }
        }}
      />
      <div />
    </React.Fragment>
  );
};

DumpAvatarUpload.propTypes = () => ({
  imgUrl: PropTypes.string.isRequired,
  onUploadFile: PropTypes.func.isRequired,
  onLimitError: PropTypes.func,
  imageMaxPxLimitNumber: PropTypes.number,
  fileSizeLimitMb: PropTypes.number,
});

DumpAvatarUpload.defaultProps = () => ({
  imgUrl: '',
  onUploadFile: file => {},
  onLimitError: (errorsTexts = []) => {},
  imageMaxPxLimitNumber: 300,
  fileSizeLimitMb: 3,
});

export const Usage = () => {
  return (
    <DumpAvatarUpload
      imgUrl={`https://placehold.it/200x200`}
      onUploadFile={file => {
        alert(`uploadfile ${file}`);
      }}
      onLimitError={errTexts => {
        alert(`errTexts ${errTexts}`);
      }}
      imageMaxPxLimitNumber={500}
      fileSizeLimitMb={30}
    />
  );
};

export default DumpAvatarUpload;
