import {connect} from "react-redux";
import {createElement} from "react";

import Scrollbar from "./Scrollbar.jsx";

export default connect(state => state.Mobiler)(({mobile, children, component, role, className}) => createElement(!mobile ? Scrollbar : component, {className, component, role}, children));