export const ROLES={
 admin:{label:"System Administrator",base:"/admin",unit:"System"},
 engg:{label:"Engineering Planner",base:"/engineering",unit:"Engineering"},
 trd:{label:"TRD Planner",base:"/trd",unit:"Traction Distribution"},
 snt:{label:"S&T Planner",base:"/snt",unit:"Signal & Telecom"},
 control:{label:"Control / Senior Engineer",base:"/control",unit:"Operations Control"},
 field:{label:"Field User",base:"/field",unit:"Field Execution"}
};
export const WORK_STATUSES=["Registered","Validated","Prioritized","Window Proposed","Bundled","Plan Proposed","Approved","Published","Executing","Completion Submitted","Verified","Closed"];
export const WORKS=[
{id:"WR-1042",title:"Rail joint renewal",dept:"Engineering",corridor:"PUNE-DADAR",section:"KYN-PNVL",asset:"RJ-2041",criticality:"Critical",risk:92,overdue:12,duration:90,status:"Prioritized",crew:6,preferred:"22:00-01:00",dependencies:[],created:"01 Sep 2026"},
{id:"WR-1043",title:"OHE insulator replacement",dept:"TRD",corridor:"PUNE-MUM",section:"LNL-PUNE",asset:"OHE-883",criticality:"High",risk:78,overdue:8,duration:75,status:"Window Proposed",crew:5,preferred:"01:00-03:00",dependencies:["WR-1042"],created:"31 Aug 2026"},
{id:"WR-1044",title:"Signal cable inspection",dept:"S&T",corridor:"PUNE-MUM",section:"PUNE-LNL",asset:"SIG-441",criticality:"Medium",risk:51,overdue:2,duration:60,status:"Registered",crew:4,preferred:"23:00-01:00",dependencies:[],created:"01 Sep 2026"},
{id:"WR-1045",title:"Track geometry correction",dept:"Engineering",corridor:"PUNE-SOL",section:"PUNE-SSI",asset:"TRK-721",criticality:"High",risk:84,overdue:17,duration:120,status:"Executing",crew:8,preferred:"00:00-02:00",dependencies:[],created:"28 Aug 2026"},
{id:"WR-1046",title:"Point machine maintenance",dept:"S&T",corridor:"PUNE-MUM",section:"LNL-PUNE",asset:"PM-119",criticality:"Critical",risk:95,overdue:6,duration:90,status:"Completion Submitted",crew:3,preferred:"02:00-03:30",dependencies:[],created:"27 Aug 2026"},
{id:"WR-1047",title:"OHE mast foundation inspection",dept:"TRD",corridor:"PUNE-SOL",section:"PUNE-SSI",asset:"OHE-M55",criticality:"Low",risk:33,overdue:0,duration:45,status:"Validated",crew:3,preferred:"12:00-13:00",dependencies:[],created:"01 Sep 2026"},
{id:"WR-1048",title:"Rail fracture ultrasonic inspection",dept:"Engineering",corridor:"MUM-PUNE",section:"KJT-PUNE",asset:"RAIL-09",criticality:"Critical",risk:98,overdue:1,duration:60,status:"Plan Proposed",crew:5,preferred:"03:00-04:00",dependencies:[],created:"01 Sep 2026"}
];
export const PLANS=[
{id:"BP-2026-091",date:"03 Sep 2026",window:"00:00–02:00",corridor:"PUNE-SOL",section:"PUNE-SSI",status:"Proposed",departments:["Engineering","TRD"],works:["WR-1045","WR-1047"],score:91,impact:"Low",conflicts:0},
{id:"BP-2026-092",date:"04 Sep 2026",window:"02:00–04:00",corridor:"PUNE-MUM",section:"LNL-PUNE",status:"Awaiting Approval",departments:["TRD","S&T"],works:["WR-1043","WR-1046"],score:96,impact:"Medium",conflicts:0},
{id:"BP-2026-093",date:"05 Sep 2026",window:"23:00–01:00",corridor:"KYN-PNVL",section:"KYN-PNVL",status:"Published",departments:["Engineering"],works:["WR-1042"],score:82,impact:"Low",conflicts:0}
];
export const TRAINS=[
{id:"12124",name:"Deccan Queen",type:"Express",corridor:"PUNE-MUM",eta:"07:25",risk:"Normal"},
{id:"11010",name:"Sinhagad Express",type:"Express",corridor:"PUNE-MUM",eta:"08:10",risk:"Block conflict"},
{id:"22150",name:"Pune-Mumbai SF",type:"Superfast",corridor:"PUNE-MUM",eta:"09:00",risk:"Normal"},
{id:"11418",name:"Pune-Solapur",type:"Passenger",corridor:"PUNE-SOL",eta:"09:35",risk:"Normal"}
];
export const ALERTS=[
{level:"Critical",title:"Critical defect approaching SLA",detail:"WR-1048 requires a feasible block within 24 hours."},
{level:"Warning",title:"Integrated opportunity found",detail:"WR-1043 and WR-1046 share the LNL-PUNE section."},
{level:"Info",title:"Completion evidence awaiting review",detail:"WR-1046 has 4 photos and supervisor notes submitted."}
];
