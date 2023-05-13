export default ({ message, onConfirm, buttonLabel, onDismiss }) => {
    return <div className="alert alert-danger alert-dismissible m-3">
        <div className="d-flex align-items-center">
        <span>{message}</span>
            <button className="mx-1 btn btn-outline-danger btn-sm" onClick={onConfirm}>
                {buttonLabel}
            </button>
            <button onClick={onDismiss} type="button" class="btn-close" />
        </div>
        
    </div>
}