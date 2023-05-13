import blankProfile from "../assets/blankProfile.webp"
export default ({ data }) => {
    return <div className="card mb-2 p-1" >
        <div className="card-body p-0">
            <img
                className="me-1 mt-1"
                src={data.profile.picture || blankProfile} 
                style={{ height: 30, width: 30, borderRadius: '50%' }}
            />
            <span className="card-text fw-bold underline">{data.profile.name}</span>
            <p className="card-text">{data.body}</p>
        </div>
    </div>
}