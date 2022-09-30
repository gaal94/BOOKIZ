import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BookPage from "./BookPage"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { bookApis, fetchData } from '../../utils/apis/api';
import { useLocation, useSearchParams } from 'react-router-dom';

function Content() {
  const [bookContents, setBookContents] = useState([
    {page: 1, content: "옛날 어느 마을에 가난하지만 정직하고 마음씨 착한 나무꾼이 살고 있었어요.", image: "assets/images/금도끼 은도끼/1.jpg", audio: "", type: 1},
    {page: 2, content: "아이쿠, 이런! 내 도끼", image: "assets/images/금도끼 은도끼/2.jpg", audio: "", type: 0 },
    {page: 3, content: "그때였어요. 연못에서 갑자기 하얀 연기가 일더니 하얀 옷을 입은 산신령이 나타났어요.", image: "assets/images/금도끼 은도끼/3.jpg", audio: "", type: 1}
  ]);

  const [page, setPage] = useState(1);

  const [isPageChanged, setIsPageChanged] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getBookContents = async (url) => {
      return await fetchData.get(url);
    };
    const res = getBookContents(bookApis.BOOK_START(searchParams.get('id')));
    res.then((bookcontents) => {
      setBookContents(bookcontents.data);
    });
  }, []);

  return (
    <Container>
      <BookPage
        page={bookContents[page - 1].page}
        content={bookContents[page - 1].content}
        image={bookContents[page - 1].image}
        audio={bookContents[page - 1].audio}
        totalpage={bookContents.length}
        type={bookContents[page - 1].type}
        setPage={setPage}
        isPageChanged={isPageChanged}
        setIsPageChanged={setIsPageChanged}
      />
      {page > 1 &&
        <LeftPageButton onClick={() => {
          setPage(page - 1)
          setIsPageChanged(true)
          }}>
          <AiOutlineLeft size={50} color={"white"} />
        </LeftPageButton>
      }
      {page < bookContents.length &&
        <RightPageButton onClick={() => {
          setPage(page + 1)
          setIsPageChanged(true)
        }}>
          <AiOutlineRight size={50} color={"white"} />
        </RightPageButton>
      }
    </Container>
  );
}

export default Content;

const Container = styled.div`
  max-width: 100%;
  position: relative;
`;

const LeftPageButton = styled.div`
  position: absolute;
  top: 45vh;
  left: 5.4167vw;
  cursor: pointer;
`;

const RightPageButton = styled.div`
  position: absolute;
  top: 45vh;
  right: 5.4167vw;
  cursor: pointer;
`;