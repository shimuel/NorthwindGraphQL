import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_CUSTOMERS_PAGE } from '../../graphql/queries'
import  { EDIT_MODE, EDITMODE_METADATA } from '../grid/GridExtn'
import  {GridWrapper} from '../grid/GridWrapper'

const FirstView = () => {

    return <span>First Component</span>
}

export {
    FirstView
}