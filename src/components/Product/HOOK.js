import React from 'react';
import teg from "./Hook.module.css";
import Preloader from "../../components/common/Preloader/Preloader";
import {NavLink, Route, Routes} from "react-router-dom";

function Hook(props) {
    if (!props.profile) {
        return <Preloader/>
    }

    return (
        <div>
            <div className={teg.im}>
                <img
                    src='https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'/>
            </div>
            <div><button onClick={props.pusk}>pusk</button> </div>
            <div><h2>Id: {props.prodId}   Name: {props.prodName}</h2>;</div>
            <div className={teg.descriptionBlock} key={props.profile.id}>
                <img className={teg.ava} src={props.profile.photos.large}/>
                <h3>{props.profile.fullName}</h3>
                <p><b>О бо мне:</b> {props.profile.aboutMe}</p>
                <p><b>Мои соц.сети:</b>
                    <li><a href="https://www.facebook.com/">Facebook</a></li>
                    <li><a href={"http://www." + props.profile.contacts.vk}>Vk</a></li>
                    <li><a href={props.profile.contacts.twitter}>Twitter</a></li>
                    <li><a href={"http://www.instagram.com/sdc"}>Instagram</a></li>
                    <li>Youtube:</li>
                </p>
                hook = diskrip
            </div>
        </div>
    );
}

export default Hook;