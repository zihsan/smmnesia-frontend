import Image from 'next/image';

const AvatarRing = ({
    src,
    alt = "Avatar",
    className = "",
}) => {
    return (
        <div className="avatar">
            <div
                className={`rounded-full ring ring-offset-4 ring-offset-base-300 ${className}`}
            >
                <Image unoptimized
                    src={src}
                    alt={alt}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`rounded-full object-cover`}
                />
            </div>
        </div>
    );
};

export default AvatarRing;
