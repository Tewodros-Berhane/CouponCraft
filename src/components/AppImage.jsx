import React from 'react';

function Image({
  src,
  alt = "",
  className = "",
  fallbackSrc = "/assets/images/no-image.png",
  ...props
}) {
  const hadErrorRef = React.useRef(false);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={props.loading ?? "lazy"}
      decoding={props.decoding ?? "async"}
      onError={(e) => {
        if (hadErrorRef.current) return;
        hadErrorRef.current = true;
        if (fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
      {...props}
    />
  );
}

export default Image;
