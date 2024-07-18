import { useState, useEffect } from 'react';
import { userAPI } from '../../api/axios';
import { v4 as uuid } from 'uuid';
import { getStorage, setStorage } from '../../storage/storage';
import { useParams, Navigate } from 'react-router-dom';
import authAPI from '../../api/axios';
import { jobAPI } from '../../api/axios';
import ProfileHead from '../../components/ProfileHead/ProfileHead';
import ContactCard from '../../components/ContactCard/ContactCard';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FeatureBoxMiddlePaneText from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneText';
import FeatureBoxMiddlePaneOpenings from '../../components/FeatureBoxMiddlePane/FeatureBoxMiddlePaneOpenings';
import './EmployerProfileSection.css';
export default function OtherEmployerProfile({ data }) {
    const [newData, SetnewData] = useState(data);
    const [isNotEditing, SetIsNotEditing] = useState(true)
    const [jobVacancies, SetJobVacancies] = useState([]);
    const updateEditStatus = (value) => {
        SetIsNotEditing(value)
    }
    const redirectFn = (data) => {
        setStorage("guestUserID", data.user_id)
        setStorage("guestUsername", data.username)
        setStorage("guestUserType", data.user_type)
        console.log("Users:", data)
        SetnewData(data)
    }

    const params = useParams();
    const user = params.username;
    const callAPI = async () => {
        try {
            const response = (user === undefined) ?
                await userAPI.get(`/recruiter/profile`, {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }) :
                await userAPI.get(`/profile/${user}`);
            console.log(response)
            redirectFn(response.data)
        } catch (e) {
            console.log(e)

            alert(e.message)
        }
    }
    useEffect(() => {
        const profileAPI = async () => {
            try {
                const response = (user === undefined) ?
                    await userAPI.get(`/recruiter/profile`, {
                        headers: {
                            'Authorization': `Bearer ${getStorage("userToken")}`
                        }
                    }) :
                    await userAPI.get(`/profile/${user}`);
                console.log(response)
                redirectFn(response.data)
            } catch (e) {
                console.log(e)

                alert(e.message)
            }
        };
        profileAPI();
    }, []);

    useEffect(() => {
        if (getStorage("guestUserID")) {
            const callJobVacancyAPI = async (companyId) => {
                try {
                    const response = await jobAPI.get(`/job_vacancy/company/${companyId}`);
                    const mod_response = response.data.map(e => ({ id: e.job_id, jobTitle: e.job_name, companyId: e.company_id, companyName: e.company_name, tags: e.tags, currency: e.salary.split('-')[0], salary: [e.salary.split('-')[1], e.salary.split('-')[2]], postDate: e.created_at.split('T')[0], last_date: e.last_date.split('T')[0], location: e.location, empType: e.emp_type, exp: e.experience, workStyle: e.work_style, workingDays: e.working_days, jobDesc: e.job_desc, jobReq: e.requirement, skills: e.skills.length ? e.skills : [{ 'skill': "" }], applicationsReceived: e.job_seekers }))
                    SetJobVacancies(mod_response);
                    console.log(response);
                    console.log(" after new job vacancies", mod_response);

                } catch (e) {
                    console.log("jobs failed for id", getStorage("userID"), e)

                    alert(e.message);
                }
            }
            callJobVacancyAPI(getStorage("guestUserID"))
        }
    }, [newData])
    const [redirectHome, SetRedirectHome] = useState(false);
    const logOut = () => {
        console.log('helo')
        SetRedirectHome(true)
    }
    return (
        <div id="employer-profile-page">
            {redirectHome && <Navigate to='/' />}
            <ProfileHead access="viewOnly" data={newData} isNotEditing={isNotEditing} setIsNotEditing={updateEditStatus} />
            <NavigationBar active="employer-profile" />
            <div className="employer-profile-body-section">
                <div className="employer-profile-pane employer-profile-left-pane">
                    {/* <FeatureBox data={{ title: "At a Glance" }} /> */}
                    <DetailsCard data={{
                        title: "Company Details", addIcon: false, editIcon: true
                    }} access="viewOnly" companyInfo={newData} reloadFn={callAPI} />
                    {/* {industry: "Aviation", companysize: "10000+", hq: "india", specialities: ['space', 'aviation', 'hardware', 'technology', 'robotics', 'defense'], locations: "7+" } */}
                    <ContactCard data={{
                        title: "Contacts and Profiles", addIcon: false, editIcon: true
                    }} access="viewOnly" contactData={newData} reloadFn={callAPI} />


                </div>
                <div className="employer-profile-pane employer-profile-middle-pane">
                    <FeatureBoxMiddlePaneText access="viewOnly" data={{ title: "About", edit: false }} childData={newData.overview}
                        reloadFn={callAPI} />
                    <FeatureBoxMiddlePaneOpenings data={{ title: "Recent Job Openings", edit: false, vacancies: jobVacancies, userType: "seeker" }} childData={{ text: "This is for demo purpose only" }} />
                    {/* <FeatureBoxMiddlePaneReview data={{title: "Reviews", edit: false}} childData={{text: "This is for demo purpose only"}}/> */}


                    <div className="spacer-div" ></div>

                </div>
                {/* <div className="employer-profile-pane employer-profile-right-pane">
                    <FeatureBox data={{ title: "Achievements and Rankings", addIcon: true, editIcon: true }} />
                </div> */}
            </div>
        </div>
    )
}