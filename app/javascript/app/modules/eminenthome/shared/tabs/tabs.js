import React, {useState} from "react";
import "./tabs.css"

const Tabs = (props) => {


    return (
        <>

            <div className="tabsDiv d-flex flex-column">
                <div className="navBar d-flex justify-content-between mt-2">
                    <ul>
                        <li>Home</li>
                        <li>Allotment</li>
                        <li>File Status</li>
                        <li>Master of Vacancies</li>
                        <li>Slotting</li>
                        <li>GOM Management</li>
                    </ul>
                    <p className="fa-border">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.0001 22C13.1001 22 14.0001 21.1 14.0001 20H10.0001C10.0001 20.5304 10.2108 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12.0001 22ZM18.0001 16V11C18.0001 7.93 16.3601 5.36 13.5001 4.68V4C13.5001 3.17 12.8301 2.5 12.0001 2.5C11.1701 2.5 10.5001 3.17 10.5001 4V4.68C7.63005 5.36 6.00005 7.92 6.00005 11V16L4.71005 17.29C4.08005 17.92 4.52005 19 5.41005 19H18.5801C19.4701 19 19.9201 17.92 19.2901 17.29L18.0001 16Z"
                                fill="black"/>
                        </svg>
                    </p>
                </div>
            </div>
        </>
    )
}
export default Tabs;