import {createElement} from "react"
import {connect} from "react-redux";

import Scrollbar from "./Scrollbar.jsx"

export default connect(state => state.Mobiler)(({mobile, className, component, reverse, children, role}) => createElement(!mobile ? Scrollbar : reverse ?? component, {className, role, ...(!mobile ? {component} : {})}, children));