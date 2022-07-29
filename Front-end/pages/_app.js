import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import "../assets/antd-custom.less";
import store from "../store/store";
import App from "../assets/CustomLayout";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <App>
      <Component {...pageProps} />
      </App>
    </Provider>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
