import {styled} from "styled-components";
import React, {useState, useEffect} from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const Home = () => {
  const [data, setData] = useState([]); // 데이터 상태
  const [page, setPage] = useState(1); // 현재 페이지 -> 나중에 무한스크롤시 페이지의 상태를 체크하기 위해서
  const [loading, setLoading] = useState(false);
  //로딩상태를 관리하기 위한 상태변수
  // loading의 상태를 관리하기 위해 setLoading 상태변수를 관리하기 위한 함수라 완료되면 false 로딩이 진행중일 때는 true!
  const [numProductsToShow, setNumProductsToShow] = useState(4); // 초기에 보여줄 상품 개수
  const productsPerPage = 2; // 스크롤마다 불러올 제품 수

  // 초기 데이터를 불러오는 함수
  const fetchInitialData = async () => {
    if (loading) return;
    //로딩중일때 true이면 함수 종료 호출 부분으로 도라가~

    setLoading(true);

    try {
      const response = await fetch(`https://openmarket.weniv.co.kr/products/?page=${page}`);
      // fetch 함수를 사용하여 url에 get 요청을 보냈고 응답을 기다리는 코드 {page} 는 현재 페이지 번호를 나타낸다,
      const responseData = await response.json();
      //서버에서 받아온 응답을 json 형식으로 변환~ => js 객체로 사용할 수 있응게

      const newProducts = responseData.results;
      //json 응답에서 데이트럴 뽑아서 newProducts 변수에 저장 reaults 속성에 원하는 데이터가 포함되어 있다고 가정 ??

      if (newProducts.length === 0) {
        setLoading(false);
        // newProduct의 길이가 0 이라면? => 받아온 데이터가 없거나 모두 불러왔으면 다음을 실행합니당
        // loading 상태를 false로 바꿔서 로딩 중 표시를 해제합니다.
        return;
        // 데이터가 없거나 모두 불러온 함수를 종료 더 이상 데이터를 불러오지 않는다.
      }

      // 초기에 보여줄 상품 개수만큼 잘라냅니다. 0부터 numProductsToShow(4) 까지 잘라서 initialProducts 배열에 저장합니다.
      const initialProducts = newProducts.slice(0, numProductsToShow);

      // 초기 데이터로 설정
      // initialProducts 배열을 사용하여 화면에 보여줄 데이터 상태를 업데이트
      setData(initialProducts);

      setPage((prevPage) => prevPage + 1);
      //다음에 불러올 데이터를 위해 페이지 번호를 증가시킵니다.
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      //어째꺼나 마지막에는 setLoading(false) 호출하여 로딩 상태를 해제합니다
    } finally {
      setLoading(false);
    }
  };

  // 초기데이터를 불러오는 함수 다음으로 데이터를 불러오는 함수
  const fetchData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`https://openmarket.weniv.co.kr/products/?page=${page}`);
      const responseData = await response.json();

      const newProducts = responseData.results;
      //json 응답에서 데이트럴 뽑아서 newProducts 변수에 저장 reaults 속성에 원하는 데이터가 포함되어 있다고 가정 ??
      if (newProducts.length === 0) {
        setLoading(false);
        return;
      }

      // 스크롤마다 불러올 제품 수만큼 잘라냅니다.
      const slicedNewProducts = newProducts.slice(numProductsToShow, numProductsToShow + productsPerPage);
      //초기 보여주는 상품, 초기상품+스크롤마다 불러오는 개수
      setData((prevData) => [...prevData, ...slicedNewProducts]);
      //slicedNewProducts 배열을 이전데이타 PreData에 추가하여 화면에 새로운 제품을 렌더링링링
      setNumProductsToShow((prevNum) => prevNum + productsPerPage);
      // setNumProductsToShow 상태변수를 업데이트 -> 보여줄 제품 수를 증가시킵니다. -> 범위 증가
      setPage((prevPage) => prevPage + 1);
      //page 상태변수를 업데이트 하여 api에서 가져올 페이지 번호를 증가~
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 무한 스크롤 커스텀 훅 사용
  const [isFetching] = useInfiniteScroll(fetchData);
  //페이지 끝에 도달하면 fetchData 함수를 호출 추가 데이터를 불러오도록 한ㄷㅏ.

  useEffect(() => {
    fetchInitialData(); // 초기 데이터 로딩
  }, []);
  // [] 배열은 종속성 배열로, 이 배열이 비어 있으므로 컴포넌트가 마운트 될 때 한번만 실행 된다.

  return (
    <>
      <MainSection>
        <ul className="productList">
          {data.map((item, index) => (
            <li className="product" key={index}>
              <p>
                {index + 1}. {item.product_name}
              </p>
              <p className="content">Price: {item.price}</p>
              <p>재고량: {item.stock}</p>
            </li>
          ))}
        </ul>
        {isFetching && <p>Loading more data...</p>}
      </MainSection>
    </>
  );
};

const MainSection = styled.section`
  border: 1px solid red;
  width: 50%;
  margin: 0 auto;
  .productList {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .product {
    border: 2px solid black;
    width: 50%;
    height: 200px;
    margin: 0 auto;
  }
`;

export default Home;
