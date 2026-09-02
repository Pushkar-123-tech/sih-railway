import React from "react";
import {Link} from "react-router-dom";
export default function NotFound(){return <div className="center-page"><h1>404</h1><p>This RailPlan screen does not exist.</p><Link className="primary-link" to="/login">Return to login</Link></div>}
