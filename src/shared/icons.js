const html = (strings) => {
  const content = strings[0];
  const trimmed = content.replace(/<!--(.*?)-->|\s\B/gm, "").trim();
  return trimmed;
};

exports.foodBasket = html`
  <svg
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.7188 13.125H3.28125C2.67694 13.125 2.1875 13.6144 2.1875 14.2188V16.4062C2.1875 17.0106 2.67694 17.5 3.28125 17.5H31.7188C32.3231 17.5 32.8125 17.0106 32.8125 16.4062V14.2188C32.8125 13.6144 32.3231 13.125 31.7188 13.125Z"
      fill="#006C58"
    />
    <path
      d="M19.6875 7.65625L18.5938 5.46875H15.3125L14.2188 7.65625C13.6514 8.78965 13.2481 10.5506 13.125 12.0312H20.7812C20.6582 10.5506 20.2549 8.78965 19.6875 7.65625Z"
      fill="#006C58"
    />
    <path
      d="M18.5938 3.28125C18.5938 2.67694 18.1043 2.1875 17.5 2.1875H16.4062C15.8019 2.1875 15.3125 2.67694 15.3125 3.28125V4.375H18.5938V3.28125Z"
      fill="#006C58"
    />
    <path
      d="M5.4782 29.9646C5.69422 31.5888 7.09285 32.8124 8.73075 32.8124H26.25C27.8879 32.8124 29.2865 31.5888 29.4943 30.0138C29.4943 30.0138 31.7188 18.658 31.7188 18.5936H3.28125C3.28125 18.6579 5.4783 29.9644 5.4783 29.9644L5.4782 29.9646ZM24.0789 29.9454L26.2664 21.1954C26.3389 20.9015 26.6356 20.7265 26.9295 20.7976C27.2221 20.8714 27.4012 21.1681 27.3274 21.4607L25.1399 30.2107C25.0783 30.4595 24.8555 30.6249 24.6094 30.6249C24.5657 30.6249 24.5205 30.6194 24.4768 30.6085C24.1842 30.5347 24.0051 30.238 24.0789 29.9454L24.0789 29.9454ZM20.7854 21.2612C20.8223 20.9618 21.0957 20.7458 21.3952 20.7868C21.6946 20.8237 21.9078 21.0972 21.8696 21.3979L20.7758 30.1479C20.7416 30.4241 20.5051 30.6265 20.2344 30.6265C20.2125 30.6265 20.1893 30.6251 20.1661 30.6224C19.8666 30.5854 19.6534 30.312 19.6916 30.0112L20.7854 21.2612ZM13.6034 20.7854C13.9042 20.7444 14.1762 20.9604 14.2132 21.2599L15.3069 30.0099C15.3438 30.3106 15.1319 30.5841 14.8325 30.621C14.8106 30.6237 14.7874 30.6251 14.7655 30.6251C14.4934 30.6251 14.2583 30.4228 14.2241 30.1466L13.1303 21.3966C13.092 21.0958 13.3039 20.8224 13.6034 20.7854L13.6034 20.7854ZM8.07023 20.7964C8.36417 20.7253 8.66085 20.9016 8.7333 21.1942L10.9208 29.9442C10.9946 30.2368 10.8155 30.5335 10.523 30.6073C10.4792 30.6182 10.4341 30.6237 10.3903 30.6237C10.1456 30.6237 9.92278 30.4583 9.85988 30.2094L7.67238 21.4594C7.59855 21.1669 7.77765 20.8702 8.07023 20.7964L8.07023 20.7964Z"
      fill="#006C58"
    />
    <path
      d="M24.0625 5.46875H29.5312C30.1356 5.46875 30.625 4.97931 30.625 4.375V3.28125C30.625 2.67694 30.1356 2.1875 29.5312 2.1875H24.0625C23.4582 2.1875 22.9688 2.67694 22.9688 3.28125V4.375C22.9688 4.97931 23.4582 5.46875 24.0625 5.46875Z"
      fill="#006C58"
    />
    <path
      d="M31.7188 10.9375C31.7188 9.52658 30.7986 8.27011 29.5312 7.83944V6.5625H24.0625V7.83944C22.7951 8.27011 21.875 9.52654 21.875 10.9375V12.0312H31.7188V10.9375Z"
      fill="#006C58"
    />
    <path
      d="M5.46865 12.0312H12.0311L10.448 8.91946L8.58995 10.7775C8.48331 10.8841 8.34249 10.9374 8.20302 10.9374C8.06356 10.9374 7.92275 10.8841 7.8161 10.7775C7.60281 10.5642 7.60281 10.2183 7.8161 10.0037L9.92565 7.8941L8.6036 5.29507L6.40241 7.49625C6.29577 7.6029 6.15495 7.65621 6.01549 7.65621C5.87602 7.65621 5.73521 7.6029 5.62856 7.49625C5.41528 7.28297 5.41528 6.93706 5.62856 6.72244L8.08266 4.26834L7.92953 3.96757C7.44828 2.88474 6.37368 2.1875 5.1897 2.1875C3.01998 2.1875 1.5679 4.42148 2.44986 6.40395L5.46865 12.0312Z"
      fill="#006C58"
    />
  </svg>
`;

exports.familyPeople = html`
  <svg
    width="35"
    height="35"
    viewBox="0 0 69 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.0977 38.6779C39.7126 37.5172 39.4947 36.2794 39.4947 34.9964C39.4947 34.5634 39.5213 34.1357 39.5665 33.716C38.3685 33.0732 36.9022 32.5075 35.2341 32.0373C32.7266 36.1252 28.4022 38.893 23.5973 38.893C18.7948 38.893 14.4676 36.1252 11.9604 32.0373C8.32665 33.0573 5.66248 34.5395 4.61032 36.2527C3.29282 37.9767 2.48267 40.253 2.48267 42.7579C2.48267 45.0476 3.19986 47.1486 4.35001 48.8088C5.82956 52.3044 13.8809 54.9739 23.5947 54.9739C27.3772 54.9739 30.9074 54.5675 33.8981 53.8663C32.9365 52.2805 32.4265 50.4636 32.4265 48.567C32.4265 46.3145 33.1331 44.1311 34.416 42.4072C35.521 40.7151 37.6088 39.5039 40.0978 38.6778L40.0977 38.6779Z"
      fill="#006C58"
    />
    <path
      d="M23.5974 36.3591C29.5448 36.3591 34.9636 30.8447 34.9636 24.0423C34.9636 17.2398 29.8742 11.7254 23.5974 11.7254C17.3207 11.7254 12.2312 17.2398 12.2312 24.0423C12.2312 30.8447 17.65 36.3591 23.5974 36.3591Z"
      fill="#006C58"
    />
    <path
      d="M64.0302 43.85C63.3343 42.7157 61.6635 41.7223 59.3765 40.9945C57.4533 44.2431 54.0587 46.4638 50.2706 46.4638C46.4828 46.4638 43.0884 44.2458 41.1647 40.9945C38.8777 41.7223 37.2069 42.7157 36.5109 43.85C35.5547 45.0984 34.9677 46.7479 34.9677 48.5648C34.9677 50.225 35.4883 51.747 36.3223 52.9503C37.3955 55.4817 43.2311 57.4181 50.2705 57.4181C57.3099 57.4181 63.1483 55.4816 64.2187 52.9503C65.0528 51.747 65.5734 50.225 65.5734 48.5648C65.5707 46.7479 64.9837 45.0984 64.0301 43.85H64.0302Z"
      fill="#006C58"
    />
    <path
      d="M50.2681 43.9268C54.5792 43.9268 58.5077 39.9292 58.5077 34.9991C58.5077 30.069 54.8181 26.0714 50.2681 26.0714C45.718 26.0714 42.0286 30.069 42.0286 34.9991C42.0286 39.9292 45.9571 43.9268 50.2681 43.9268Z"
      fill="#006C58"
    />
  </svg>
`;

exports.moneyStack = html`
  <svg
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.5803 13.4054C27.5803 14.2804 26.8448 15.0159 25.9698 15.0159C25.0948 15.0159 24.3592 14.2804 24.3592 13.4054C24.3592 12.5304 25.0948 11.7948 25.9698 11.7948C26.8448 11.7948 27.5803 12.5304 27.5803 13.4054ZM9.03034 11.7948C8.15534 11.7948 7.41978 12.5304 7.41978 13.4054C7.41978 14.2804 8.15534 15.0159 9.03034 15.0159C9.90534 15.0159 10.6409 14.2804 10.6409 13.4054C10.6395 12.5304 9.93954 11.7948 9.03034 11.7948ZM32.8303 6.58051V20.2305C32.8303 21.7002 31.6409 22.8911 30.1698 22.8911L4.83048 22.8897C3.36076 22.8897 2.16992 21.7003 2.16992 20.2291V6.57914C2.16992 5.10942 3.35936 3.91858 4.83048 3.91858H30.1698C31.6395 3.91995 32.8303 5.11075 32.8303 6.5805V6.58051ZM30.5553 9.45023C30.3448 9.51995 30.1356 9.51995 29.8909 9.51995C28.4212 9.51995 27.1962 8.33051 27.1962 6.82523C27.1962 6.61469 27.2317 6.36995 27.2659 6.16079H7.56056C7.5961 6.33579 7.5961 6.47525 7.5961 6.65023C7.5961 8.11995 6.40666 9.34495 4.90138 9.34495C4.72638 9.34495 4.58693 9.34495 4.44611 9.30941L4.44474 17.5001C4.58419 17.4646 4.75919 17.4646 4.90002 17.4646C6.36974 17.4646 7.59474 18.654 7.59474 20.1593C7.59474 20.3343 7.59474 20.5093 7.55919 20.6487H27.2288C27.2288 20.5434 27.1933 20.4382 27.1933 20.2987C27.1933 18.829 28.3827 17.604 29.888 17.604C30.1327 17.604 30.3433 17.6395 30.5525 17.6737L30.5553 9.45023ZM31.6751 24.7109H3.32506C2.69478 24.7109 2.20534 25.2004 2.20534 25.8307C2.20534 26.4609 2.73034 26.9504 3.36062 26.9504H31.7106C32.3409 26.9504 32.8303 26.4609 32.8303 25.8307C32.8303 25.2004 32.3053 24.7109 31.6751 24.7109ZM31.6751 28.8056H3.32506C2.69478 28.8056 2.20534 29.295 2.20534 29.9253C2.20534 30.5556 2.69478 31.045 3.32506 31.045H31.6751C32.3053 31.045 32.7948 30.5556 32.7948 29.9253C32.7948 29.295 32.3053 28.8056 31.6751 28.8056ZM23.3108 13.4056C23.3108 16.6253 20.7213 19.2163 17.5001 19.2163C14.2803 19.2163 11.6894 16.6268 11.6894 13.4056C11.6894 10.1859 14.2788 7.59488 17.5001 7.59488C20.7198 7.59488 23.3108 10.1857 23.3108 13.4056ZM16.9397 11.9003C16.9397 11.6898 16.9753 11.5147 17.0792 11.3753C17.1844 11.2358 17.3239 11.1648 17.5686 11.1648C17.7792 11.1648 17.9542 11.2345 18.0936 11.4095C18.1989 11.5489 18.2686 11.7239 18.2686 11.97C18.2686 12.0753 18.3739 12.145 18.4792 12.145H19.5647C19.67 12.145 19.7753 12.0398 19.7753 11.9345C19.7397 11.4451 19.6003 11.0595 19.32 10.7451C19.0397 10.3951 18.6555 10.1845 18.1647 10.1148V9.30949C18.1647 9.20422 18.095 9.13449 17.9897 9.13449H17.3253C17.22 9.13449 17.1503 9.20422 17.1503 9.30949V10.1148C16.6608 10.1845 16.2397 10.3595 15.9253 10.6753C15.5753 10.9898 15.4003 11.4451 15.4003 11.9359C15.4003 12.4965 15.5753 12.9162 15.8897 13.2306C16.2042 13.5109 16.7291 13.8253 17.4647 14.1056C17.745 14.2451 17.9541 14.3503 18.095 14.4912C18.2003 14.6306 18.27 14.8056 18.27 15.0517C18.27 15.2623 18.2003 15.4373 18.095 15.5412C17.9897 15.6806 17.8147 15.7162 17.6055 15.7162C17.3608 15.7162 17.1161 15.6464 16.9753 15.4714C16.8358 15.332 16.7647 15.1214 16.7305 14.8412C16.7305 14.7359 16.6253 14.6662 16.52 14.6662L15.4003 14.6306C15.295 14.6306 15.1897 14.7359 15.1897 14.8412C15.2253 15.4017 15.4003 15.8556 15.7503 16.1714C16.1358 16.5214 16.5897 16.6964 17.1503 16.7662V17.5017C17.1503 17.607 17.22 17.6767 17.3253 17.6767H17.9897C18.095 17.6767 18.1647 17.607 18.1647 17.5017V16.8004C18.62 16.7306 18.97 16.5556 19.2503 16.2754C19.5647 15.9609 19.7397 15.5398 19.7397 15.0148C19.7397 14.4542 19.5647 14.0345 19.2503 13.7201C18.9358 13.4056 18.4108 13.1254 17.7108 12.8095C17.3964 12.6701 17.1858 12.5292 17.0806 12.424C17.0108 12.2859 16.9397 12.1109 16.9397 11.9003L16.9397 11.9003Z"
      fill="#006C58"
    />
  </svg>
`;

exports.taxBook = html`
  <svg
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M26.5083 32.0457C27.8851 31.1037 28.7888 29.5218 28.7888 27.7281V7.48826C28.7888 6.94548 28.3472 6.50389 27.8044 6.50389H7.08474C6.54196 6.50389 6.10037 6.94548 6.10037 7.48826V26.4306H18.7935C19.0095 26.4306 19.1954 26.5249 19.3226 26.6999C19.4497 26.8749 19.4839 27.08 19.4183 27.2865C19.2856 27.7035 19.2146 28.1464 19.2146 28.6072C19.2146 30.0058 19.8749 31.2513 20.9017 32.0456C21.6372 32.6157 22.5601 32.9548 23.5622 32.9548C24.6546 32.9535 25.669 32.6185 26.5085 32.0456L26.5083 32.0457ZM19.5398 32.9535H6.10051C3.73937 32.9535 1.81721 30.2929 1.75421 28.6866C1.74737 28.5021 1.80889 28.3394 1.93741 28.2068C2.06593 28.0728 2.22452 28.0058 2.41047 28.0058H17.6712C17.6507 28.2054 17.6411 28.4064 17.6411 28.6074C17.6397 30.2699 18.3329 31.838 19.5401 32.9537L19.5398 32.9535ZM33.2472 26.8176C33.2472 29.4126 31.355 31.5657 28.875 31.9745C29.8279 30.7837 30.3639 29.2935 30.3639 27.7266V7.48819C30.3639 6.07727 29.2168 4.92882 27.8045 4.92882H10.5575V3.02979C10.5575 2.48701 10.9991 2.04541 11.5419 2.04541H32.2616C32.8043 2.04541 33.2459 2.48701 33.2459 3.02979V26.8175L33.2472 26.8176ZM14.0217 11.6966C15.4135 11.6966 16.5442 12.8259 16.5442 14.219C16.5442 15.6108 15.4148 16.7415 14.0217 16.7415C12.6299 16.7415 11.4993 15.6122 11.4993 14.219C11.5006 12.8259 12.6299 11.6966 14.0217 11.6966ZM20.8674 17.5535C22.2592 17.5535 23.3898 18.6828 23.3898 20.0759C23.3898 21.4691 22.2605 22.5984 20.8674 22.5984C19.4755 22.5984 18.3449 21.4691 18.3449 20.0759C18.3463 18.6828 19.4756 17.5535 20.8674 17.5535ZM20.8674 19.1285C21.391 19.1285 21.8148 19.5523 21.8148 20.0759C21.8148 20.5996 21.391 21.0234 20.8674 21.0234C20.3437 21.0234 19.9199 20.5996 19.9199 20.0759C19.9199 19.5523 20.3451 19.1285 20.8674 19.1285ZM19.7052 12.3213C19.9486 11.9618 20.4367 11.8661 20.7976 12.1094C21.1572 12.3528 21.2529 12.8409 21.0096 13.2018L15.1565 21.8549C14.9131 22.2144 14.4251 22.3101 14.0641 22.0668C13.7046 21.8234 13.6088 21.3353 13.8522 20.9744L19.7052 12.3213ZM14.0219 13.2715C14.5456 13.2715 14.9694 13.6953 14.9694 14.219C14.9694 14.7426 14.5456 15.1664 14.0219 15.1664C13.4983 15.1664 13.0745 14.7426 13.0745 14.219C13.0745 13.6953 13.4997 13.2715 14.0219 13.2715Z"
      fill="#077E62"
    />
  </svg>
`;

exports.waterDrops = html`
  <svg
    width="26"
    height="33"
    viewBox="0 0 26 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.76923 4.38452C4.76923 5.88452 3.5 7.26914 2 7.26914"
      stroke="white"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.2308 32.9999C15.9465 32.9999 19.7693 29.1617 19.7693 24.4271C19.7693 20.5878 14.1549 11.9205 12.0314 8.77969C11.6448 8.20788 10.8169 8.20788 10.4303 8.77969C8.30681 11.9205 2.69238 20.5878 2.69238 24.4271C2.69238 29.1617 6.51518 32.9999 11.2308 32.9999ZM16.7692 24.2305C16.7692 23.7207 16.3559 23.3074 15.8461 23.3074C15.3363 23.3074 14.923 23.7207 14.923 24.2305C14.923 25.1456 14.4936 26.0738 13.7812 26.7849C13.0685 27.4961 12.1398 27.9228 11.2307 27.9228C10.7209 27.9228 10.3076 28.3361 10.3076 28.8459C10.3076 29.3557 10.7209 29.769 11.2307 29.769C12.708 29.769 14.0869 29.088 15.0853 28.0916C16.084 27.0949 16.7692 25.7155 16.7692 24.2305Z"
      fill="#006C58"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M21.269 13.3844C23.7543 13.3844 25.769 11.3606 25.769 8.86419C25.769 7.03484 23.3527 3.12668 22.0613 1.1686C21.6812 0.592236 20.8569 0.592237 20.4768 1.1686C19.1854 3.12668 16.769 7.03484 16.769 8.86419C16.769 11.3606 18.7838 13.3844 21.269 13.3844ZM23.9228 8.3076C23.9228 7.92524 23.6128 7.61529 23.2305 7.61529C22.8481 7.61529 22.5382 7.92524 22.5382 8.3076C22.5382 8.69387 22.3555 9.10162 22.035 9.42142C21.7144 9.7414 21.3063 9.92298 20.9228 9.92298C20.5404 9.92298 20.2305 10.2329 20.2305 10.6153C20.2305 10.9976 20.5404 11.3076 20.9228 11.3076C21.7324 11.3076 22.4782 10.9353 23.0131 10.4015C23.5482 9.86741 23.9228 9.12132 23.9228 8.3076Z"
      fill="#006C58"
    />
  </svg>
`;
