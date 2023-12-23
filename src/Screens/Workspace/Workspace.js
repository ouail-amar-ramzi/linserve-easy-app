import { useAppContext } from '../../context'
import DevenirChauffeur from './DevenirChauffeur'
import WorkspaceChauffeur from './WorkspaceChauffeur'
import ProcessingRequest from './ProcessingRequest'
import { useEffect } from 'react'

export default Workspace = ({navigation}) => {
    const { user } = useAppContext()
    useEffect(()=>{
    },[user, user.isDriver])
    if ( user.isDriver === 'true' ){
        return (
            <WorkspaceChauffeur navigation={navigation} />
        )
    }
    else if ( user.isDriver === 'processing' ) {
        return (
            <ProcessingRequest navigation={navigation} />
        )
    }
    else{
        return (
            <DevenirChauffeur navigation={navigation} />
        )
    }
}