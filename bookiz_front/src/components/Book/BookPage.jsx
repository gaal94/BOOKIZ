import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import styled, { ThemeContext } from "styled-components";
import { Link } from "react-router-dom";
import { BsQuestionCircle, BsMic, BsMicFill } from "react-icons/bs";
import { IoMdExit, IoIosExit } from "react-icons/io";
import { FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import HelpModal from "../Main/HelpModal";
import HelpSwiper from "../Main/HelpSwiper";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import EndModal from "./EndModal";

const BookPage = forwardRef((props, ref) => {
	const [isHelpModal, setIsHelpModal] = useState(false);

	const [outButtonHover, setOutButtonHover] = useState(false);

	const [isAudioPlaying, setIsAudioPlaying] = useState(false);

	const [isSpeaking, setIsSpeaking] = useState(false);

	const [isEndModal, setIsEndModal] = useState(false);
	//STT 시작---------------------------------------
	const {
		transcript,
		resetTranscript,
		browserSupportsSpeechRecognition
	} = useSpeechRecognition();
	SpeechRecognition.startListening({ continuous: true, language: 'ko' });
	function stt() {
		if (props.type !== 1) {
			return;
		}
		let sText = transcript.replaceAll(' ', '');
		let cText = props.content;
		let ss = [' ', '.', '!', '?', ','];
		for (let i = 0; i < ss.length; i++) {
			cText = cText.replaceAll(ss[i], '');
		}
		let r = ' ' + cText.split('').reverse().join('');
		let h = ' ' + sText.split('').reverse().join('');
		let d = h.length < r.length ? h.length : r.length;
	
		let mat = new Array(d);
		for (let i = 0; i < d; i++) {
			mat[i] = new Array(r.length);
			mat[i][0] = i;
		}
		for (let i = 1; i < r.length; i++) {
			mat[0][i] = i;
		}
		for (let i = 1; i < d; i++) {
			for (let j = 1; j < r.length; j++) {
				mat[i][j] = Math.min(mat[i - 1][j] + 1, mat[i][j - 1] + 1, mat[i - 1][j - 1] + (h[i] == r[j] ? 0 : 1));
			}
		}
	
		if(mat[d-1][r.length-1] < r.length/5) {
			// SpeechRecognition.stopListening();
			resetTranscript(true);
			if(props.page !== props.totalpage){
				props.setPage((page) => page+1);
				props.setIsPageChanged(true);
			} else {
				setIsEndModal(true);
			}
		}
	}
	
	//STT 끝---------------------------------------
	const HelpModalHandler = () => {
		setIsHelpModal((prev) => !prev);
	};

	const audioPlay = () => {
		window.audio.play();
		setIsAudioPlaying(true);
	};

	const audioPause = () => {
		window.audio.pause();
		setIsAudioPlaying(false);
	}

	const setTts = () => {
		window.audio = new Audio();
		window.audio.src = `https://j7a103.p.ssafy.io/tts?text=${props.content}`;
		window.audio.addEventListener("ended", function() {
			if(props.page !== props.totalpage){
				props.setIsPageChanged(true);
				props.setPage((page) => page + 1);
			} else {
				setIsAudioPlaying(false);
				setIsEndModal(true);
			}
		})
	}

	function setAudio(url) {
		window.audio = new Audio();
		window.audio.src = url;
		window.audio.addEventListener("ended", function() {
			if(props.page !== props.totalpage){
				props.setIsPageChanged(true);
				props.setPage((page) => page + 1);
			} else {
				setIsAudioPlaying(false);
				setIsEndModal(true);
			}
		})
	}

	useImperativeHandle(ref, () => ({
		setEndModalFalse
	}))

	function setEndModalFalse() {
		setIsEndModal(false);
	}

	useEffect(() => {
		if (props.isPageChanged) {
			props.setIsPageChanged(false)
			if(window.audio !== undefined){
				audioPause();
			}
			setTts();
			if(props.type === 3){
				audioPlay();
			} else if (props.type === 2) {
				setAudio(props.audio);
				audioPlay();
			}
		}
	});

	useEffect(() => {
		setIsSpeaking(true);
		stt();
		setTimeout(() => {
			setIsSpeaking(false)
		}, 1000);
		},
		[transcript]
	);

	return (
		<Container>
			<BookImageDiv>
				<BookImage src={props.image} />
			</BookImageDiv>
			<BookContentDiv>
				<Empty />
				<BookContentContainer>
					<SpeakerDiv>
						{props.type === 1 &&
							<SpeakerImage>
								{isSpeaking ?
									<BsMicFill size={25} />
									: <BsMic size={25} />
								}
							</SpeakerImage>
						}
					</SpeakerDiv>
					<BookContent>
						<BookContentText>
							{props.content}
						</BookContentText>
					</BookContent>
					<SpeakerIconDiv>
						{isAudioPlaying ?
							<FaRegPauseCircle size={50} style={{ cursor: 'pointer' }} onClick={audioPause} />
							: <FaRegPlayCircle size={50} style={{ cursor: 'pointer' }} onClick={audioPlay} />
						}
					</SpeakerIconDiv>
				</BookContentContainer>
				<OutButtonDiv onMouseEnter={() => setOutButtonHover(true)} onMouseLeave={() => setOutButtonHover(false)} onClick={() => audioPause()}>
					<Link to="/" style={{ color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						{outButtonHover ? 
							<IoIosExit size={25} />
							: <IoMdExit size={25} />
						}
					</Link>
				</OutButtonDiv>
			</BookContentDiv>
			<PageInfo>
				<PageText>
					{props.page}/{props.totalpage}
				</PageText>
			</PageInfo>
			<Help>
        <BsQuestionCircle
          className="helpicon"
          size={50}
          onClick={HelpModalHandler}
        />
      </Help>
      <HelpModal open={isHelpModal} close={HelpModalHandler} title="도움 모달">
        <HelpContainer>
          <HelpSwiper />
        </HelpContainer>
      </HelpModal>
			{
				isEndModal ?
				<EndModal />
				: null
			}
		</Container>
	)
});

export default BookPage;

const Container = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2D2D2D;
`;

const BookImageDiv = styled.div`
	width: 100%;
	height: 88.8889vh;
	display: flex;
	justify-content: center;
	align-items: end;
`;

const BookImage = styled.img`
	height: 97.5%;
	user-select: none;
`;

const BookContentDiv = styled.div`
	width: 100%;
	height: 11.1111vh;
	display: flex;
	align-items: center;
`;

const Empty = styled.div`
	width: 13.5417vw;
	height: 100%;
`;

const BookContentContainer = styled.div`
	width: 72.9167vw;
	height: 70%;
	display: flex;
	align-items: center;
	background-color: #EEEEEE;
	border-radius: 100px;
`;

const SpeakerDiv = styled.div`
	width: 5.2083vw;
	height: 90%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SpeakerImage = styled.div`
	width: 35px;
	height: 35px;
	background-color: #00FF19;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const BookContent = styled.div`
	width: 62.5vw;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const BookContentText = styled.p`
	text-align: center;
	margin: 0;
	font-size: 2.7778vh;
`;

const SpeakerIconDiv = styled.div`
	width: 2.6047vw;
	height: 5.5556vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const OutButtonDiv = styled.div`
	width: 35px;
	height: 35px;
	background-color: #BE3030;
	margin: 0;
	margin-left: 3.6458vw;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	cursor: pointer;
`;

const PageInfo = styled.div`
	width: 6.0417vw;
	height: 7vh;
	border-radius: 5px;
	background-color: #EEEEEE;
	position: absolute;
	top: 2.7778vh;
	left: 1.3021vw;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PageText = styled.p`
	font-size: 4vh;
	user-select: none;
`;

const Help = styled.div`
  position: absolute;
	top: 2.6667vh;
	right: 1.25vw;
  .helpicon {
    background-color: white;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
    }
  }
`;

const HelpContainer = styled.main`
  max-width: 1440px;
  max-height: 600px;
`;