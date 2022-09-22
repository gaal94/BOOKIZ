// import { useState } from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
// import { BsMic } from "react-icons/bs";
// import { BsMicMute } from "react-icons/bs";
import { Link } from "react-router-dom";

function BookModal(props) {
  const { open, close, title, info, image, page } = props;
  // const [mic, setMic] = useState(false);
  // const handleMic = () => {
  //   setMic(!mic);
  // }

  return (
    <div>
      {open ? (
      <Background onClick={close}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <main>
            <header>
              <IoClose
                className="closeicon"
                size={40}
                color="#ffffff"
                onClick={close}
                ></IoClose>
            </header>
            <Book>
              <div style={{ padding: "0 5% 0 1%", width: "50%", height: "100%"}}>
                <img src={image} alt="" style={{ width: "100%", height: "100%" }}/>
              </div>
              <div style={{ padding: "0 1% 0 5%", width: "50%", height: "100%" }}>
                <Text>{title}</Text>
                <Info>{info}</Info>
              </div>
            </Book>
            <Start>
              {/* <div className="micIcon" onClick={handleMic}>
                {mic ? (
                  <BsMic className="micicon" size={40} color="#000000"/>
                ) : (
                  <BsMicMute className="micmuteicon" size={40} color="#000000"/>
                )}
              </div> */}
              <Link to="/book" style={{ textDecoration: "none", width: "30%", height: "70%"}}>
                <StartBtn className="startbtn">시작하기</StartBtn>
              </Link>
              <Page>총 {page} 페이지</Page>
            </Start>
          </main>
        </Modal>
      </Background>
      ) : null}
    </div>
  );
}

export default BookModal;

const Background = styled.div`
  background-color: rgba(13, 12, 15, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  & section {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 70%;
    // max-width: 1400px;
    background-color: ${(props) => props.theme.colors.gray};
    & header {
      display: flex;
      border-width: 100%;
      height: 5%;
      justify-content: flex-end;
      padding-left: 2%;
      padding-right: 2%;
      align-items: end;
      color: ${(props) => props.theme.colors.white};
      & p {
        font-size: 24px;
        font-weight: 700;
      }
      & .closeicon {
        cursor: pointer;
      }
    }
    & main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      // padding: 0 20px 20px;
    }
  }
`;

const Start = styled.div`
  display: flex;
  width: 73%;
  height: 23%;
  justify-content: space-between;
  align-items: center;
  padding: 0 12% 0 15%;
`;

const Book = styled.div`
  display: flex;
  // height: 363px;
  width: 80%;
  height: 70%;
  justify-content: space-between;
  align-items: center;
  padding: 0 10% 0 10%;
  // margin: 0 0 10px 0;
`;

const Modal = styled.section`
  background-color: #D9D9D9;
`;

const Text = styled.p`
  color: black;
  font-size: 4vw;
  display: flex;
  font-weight: bold;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 10% 0 20% 0;
`;

const Info = styled.div`
  border-width: 100%;
  height: 40%;
  background-color: white;
  border-radius: 10px;
  font-size: 2vw;
  display: flex;
  text-align: center;
  word-break:break-all;
  justify-content: center;
  align-items: center;
  padding: 0 10px 0 10px;
`;

const StartBtn = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  border: 0;
  background-color: skyblue;
  font-size: 3vw;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Page = styled.div`
  width: 20%;
  height: 50%;
  border-radius: 10px;
  background-color: #c99999;
  font-size: 2vw;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;