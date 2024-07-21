import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { userAPI } from '../../api/axios';
import { getStorage } from '../../storage/storage';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ExperienceCard from '../ExperienceCard/ExperienceCard';
import ExperienceAdd from '../ExperienceCard/ExperienceAdd';
import NothingToShow from '../NothingToShow/NothingToShow';
export default function ExperienceBox({ access, childData, reloadFn, showSuccessMsg, showFailMsg }) {
    useEffect(() => {
        if (childData) {
            SetExpdata(childData)
        }
    }, [childData])
    const [expdata, SetExpdata] = useState([]);
    const [newExp, SetNewExp] = useState(false)
    const [totalExp, SetTotalExp] = useState(0)
    useEffect(() => {
        updateProfile()
    }, [totalExp])
    const updateProfile = async () => {
        try {

        }
        catch (e) {
            console.log(e)
        }
    }
    const updateTotalExperience = async (data) => {
        try {
            const response = await userAPI.put('/seeker/details', { "experience": data },
                {
                    headers: {
                        'Authorization': `Bearer ${getStorage("userToken")}`
                    }
                }
            );


        } catch (e) {
            console.log(e)
            // alert(e.message)
        }
    }

    useEffect(() => {
        console.log("totalExp", totalExp)
        updateTotalExperience(totalExp)
    }, [totalExp])

    const addExperience = async (e) => {
        //accepts new Experience data and adds it into existing array of Experiences
        try {
            const response = await userAPI.post('/seeker/former-job', e, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            });
            e.end_year === e.start_year ? SetTotalExp(parseInt(totalExp) + 1) :
                SetTotalExp(parseInt(totalExp) + (parseInt(e.end_year) - parseInt(e.start_year)+1))
            response.request.status === 201 && showSuccessMsg()
            console.log(response)
            SetNewExp(false)
            reloadFn()
            SetExpdata([...childData, e])
        } catch (error) {
            console.log(error)
            showFailMsg()
        }

    }
    const cancelExp = () => {
        //cancels addition of new Experience
        SetNewExp(false)
    };
    const deleteExp = async (id) => {
        //deletes existing Experience from array by referring to the id passed in
        const delExp = expdata.filter(e => { return id === e.id })
        SetTotalExp(parseInt(totalExp) - (parseInt(delExp[0].end_year) - parseInt(delExp[0].start_year)+1))
        try {
            const response = await userAPI.delete(`/seeker/former-job/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetExpdata(expdata.filter(e => { return id !== e.id }))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }
    };

    const updateExp = async (data) => {
        //updates existing Experience data from array. new data is passed in along with existing data id
        const { id, ...passData } = data
        const delExp = expdata.filter(e => { return id === e.id })
        console.log("hoda", delExp)
        const exp_update = (parseInt(delExp[0].end_year) - parseInt(delExp[0].start_year)+1)
        console.log(exp_update)
        const exp_add_update = parseInt(totalExp) - exp_update + (passData.end_year === passData.start_year ? 1 : (parseInt(passData.end_year) - parseInt(passData.start_year)+1))
        console.log(exp_add_update)
        SetTotalExp(exp_add_update)
        console.log("passData", passData)

        try {
            const response = await userAPI.put(`/seeker/former-job/${id}`, passData, {
                headers: {
                    'Authorization': `Bearer ${getStorage("userToken")}`
                }
            })
            response.request.status === 200 && showSuccessMsg()
            SetExpdata(expdata.map(e => {
                if (e.id === data.id) {
                    e = data
                }
                return (e)
            }))
        } catch (e) {
            console.log(e)
            showFailMsg()
        }

    }
    return (
        <div className="feature-box feature-box-middle-pane" id="feature-box-middle-pane">
            <h4 className="feature-title">Professional Experience</h4>
            {access !== "viewOnly" &&
                <Stack direction="row" spacing={0} className='feature-actions'>
                    <IconButton aria-label="add" onClick={() => { SetNewExp(true) }}>
                        <AddCircleRoundedIcon />
                    </IconButton>
                </Stack>}

            <div className="feature-box-container">
                {
                    (expdata.length === 0 && !newExp) &&
                    <NothingToShow />
                }

                {newExp && <ExperienceAdd submitFn={addExperience} cancelFn={cancelExp} />}

                {
                    childData && expdata.map(e => {

                        return (
                            <ExperienceCard access={access} data={e} key={uuid()} deleteFn={deleteExp} submitFn={updateExp} cancelFn={cancelExp} />
                        )
                    }
                    )
                }
            </div>
        </div>
    )
}
