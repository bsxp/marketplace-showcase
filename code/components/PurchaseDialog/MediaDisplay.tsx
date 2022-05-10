import React, { useState } from "react"
import { convertToIPFSLink } from "../../../utils/convertToIPFSLink";
import LoadingIndicator from "../../general/LoadingIndicator";

interface IMediaDisplayProps {
    prioritizeVideo?: boolean;
    imageSrc: string;
    animationSrc?: string | null;
    videoProps?: object;
    ref?: any;
    mediaStyles?: object;
    imageStyles?: object;
}

const MediaDisplay: React.FC<IMediaDisplayProps> = React.forwardRef<HTMLDivElement, IMediaDisplayProps>(({ animationSrc=null, imageSrc=null, prioritizeVideo=false, videoProps={}, mediaStyles={}, imageStyles={} }, ref) => {

	const [hadFirstHover, setFirstHover] = useState<boolean>(false);
	const [videoLoading, setVideoLoading] = useState<boolean>(true)
    
	const hasVideo = Boolean(animationSrc)
	const shouldRenderVideo = (( !imageSrc || hadFirstHover) || prioritizeVideo) && hasVideo;

	return (
		<div
			id="img-container"
			className="border border-theme-gray rounded-xl overflow-hidden relative w-full aspect-square"
			onMouseEnter={() => setFirstHover(true)}
			ref={ref}
		>
			{imageSrc && !shouldRenderVideo &&
                    <img
                    	src={convertToIPFSLink(imageSrc)} 
                    	className="h-auto w-full relative"
                    	style={{
                    		imageRendering: hasVideo ? "initial" : "pixelated",
                    		objectFit: "cover",
                    		...imageStyles
                    	}}
                    />
			}
			{shouldRenderVideo && (
				<video
					playsInline
					src={convertToIPFSLink(animationSrc!)}
					loop
					muted
					autoPlay
					preload="auto"
					style={{
						objectFit: "cover",
						...mediaStyles
					}}
					onLoadedData={() => {
						setVideoLoading(false);
					}}
					{...videoProps}
				/>
			)}
			{
				shouldRenderVideo && videoLoading && (
					<div className="h-full w-full flex justify-center items-center absolute top-0 left-0">
						<LoadingIndicator size={40} />
					</div>
				)
			}
		</div>
	)
})

export default MediaDisplay;

