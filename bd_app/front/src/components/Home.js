import '../styles/Home.css';
import '../styles/Activities.css'

function ActivityTile(props) {
    return (
        <div className="activity-item">
            <div className="activity-item-text">{props.name}</div>
        </div>);
}

function ActivityList(props) {
    const activities = props.activities;
    const activityItems = activities.map((activity) =>
            <ActivityTile name={activity}/>
    );
    return (
        <div className="activity-list">{activityItems}</div>
    );
}

function Home(props) {
    const activities = ['Люди',
    'Сотрудники'];

    return (
    <div className="home-container">
        <div className="home-content">
            {/*<div className="activities-header">*/}
            {/*    Доступные активности*/}
            {/*</div>*/}
            <ActivityList activities={activities}/>

        </div>
    </div>
    );
}

export default Home;