export const maintenance = [
  {id:"MNT-1024",source:"TMS",department:"Engineering",asset:"TRK-2381",type:"Rail Inspection",location:"KM 421/4",due:"2026-09-02",overdue:3,criticality:"CRITICAL",safety:98,trainImpact:88,duration:135,status:"Pending"},
  {id:"MNT-1192",source:"SMMS",department:"S&T",asset:"SIG-0912",type:"Signal Maintenance",location:"C2/14",due:"2026-09-04",overdue:1,criticality:"HIGH",safety:91,trainImpact:76,duration:90,status:"Pending"},
  {id:"MNT-1021",source:"TDMS",department:"Traction",asset:"OHE-883",type:"OHE Inspection",location:"KM 419/7",due:"2026-09-05",overdue:0,criticality:"HIGH",safety:72,trainImpact:81,duration:120,status:"Pending"},
  {id:"MNT-1311",source:"TMS",department:"Engineering",asset:"TRK-2441",type:"Sleeper Renewal",location:"KM 427/2",due:"2026-09-07",overdue:0,criticality:"MEDIUM",safety:67,trainImpact:63,duration:180,status:"Scheduled"},
  {id:"MNT-1410",source:"SMMS",department:"S&T",asset:"SIG-1102",type:"Relay Test",location:"C4/08",due:"2026-09-08",overdue:0,criticality:"MEDIUM",safety:61,trainImpact:54,duration:75,status:"Pending"},
  {id:"MNT-1517",source:"TDMS",department:"Traction",asset:"OHE-910",type:"Isolator Service",location:"KM 438/1",due:"2026-09-10",overdue:0,criticality:"LOW",safety:45,trainImpact:39,duration:60,status:"Pending"}
];

export const corridors = [
  {id:"C1",name:"Pune–Lonavala",section:"PUN-LNL",availability:94,blocks:12,trainDensity:"High",status:"Normal"},
  {id:"C2",name:"Pune–Daund",section:"PUN-DD",availability:81,blocks:19,trainDensity:"Very High",status:"Warning"},
  {id:"C3",name:"Daund–Solapur",section:"DD-SUR",availability:97,blocks:7,trainDensity:"Medium",status:"Normal"},
  {id:"C4",name:"Pune–Miraj",section:"PUN-MRJ",availability:72,blocks:21,trainDensity:"High",status:"Critical"}
];

export const trains = [
  {id:"12025",type:"Passenger",corridor:"C1",time:"06:25",priority:"HIGH"},
  {id:"G-204",type:"Goods",corridor:"C2",time:"07:10",priority:"MEDIUM"},
  {id:"11030",type:"Passenger",corridor:"C2",time:"07:45",priority:"HIGH"},
  {id:"G-311",type:"Goods",corridor:"C2",time:"08:20",priority:"MEDIUM"},
  {id:"12127",type:"Passenger",corridor:"C3",time:"09:15",priority:"HIGH"},
  {id:"G-418",type:"Goods",corridor:"C4",time:"10:00",priority:"MEDIUM"},
  {id:"11010",type:"Passenger",corridor:"C2",time:"10:45",priority:"HIGH"},
  {id:"G-502",type:"Goods",corridor:"C1",time:"11:25",priority:"MEDIUM"}
];

export const plans = [
  {id:"BP-2026-091",date:"2026-09-02",corridor:"C2",start:"09:00",end:"11:15",tasks:5,departments:["Engineering","S&T","Traction"],status:"Pending Approval",conflicts:0,safety:"Passed"},
  {id:"BP-2026-092",date:"2026-09-03",corridor:"C1",start:"10:30",end:"12:00",tasks:3,departments:["Engineering","S&T"],status:"Approved",conflicts:0,safety:"Passed"},
  {id:"BP-2026-093",date:"2026-09-04",corridor:"C4",start:"12:30",end:"15:00",tasks:4,departments:["Engineering","Traction"],status:"Draft",conflicts:1,safety:"Review"}
];

export const assets = [
  {id:"TRK-2381",type:"Track",department:"Engineering",location:"KM 421/4",health:82,availability:96.4,downtime:18,defects:2,criticality:"HIGH"},
  {id:"SIG-0912",type:"Signal",department:"S&T",location:"C2/14",health:76,availability:94.1,downtime:24,defects:1,criticality:"HIGH"},
  {id:"OHE-883",type:"OHE",department:"Traction",location:"KM 419/7",health:88,availability:97.2,downtime:11,defects:1,criticality:"MEDIUM"},
  {id:"TRK-2441",type:"Track",department:"Engineering",location:"KM 427/2",health:91,availability:98.1,downtime:7,defects:0,criticality:"MEDIUM"}
];

export const integrations = [
  {name:"TMS",full:"Track Management System",records:4821,defects:183,overdue:41,lastSync:"09:12",status:"Connected"},
  {name:"SMMS",full:"Signalling Maintenance & Management System",records:2143,defects:76,overdue:18,lastSync:"09:10",status:"Connected"},
  {name:"TDMS",full:"Traction Distribution Management System",records:1874,defects:54,overdue:13,lastSync:"09:08",status:"Connected"},
  {name:"COA",full:"Control Office Application",records:9302,defects:0,overdue:0,lastSync:"09:15",status:"Connected"}
];