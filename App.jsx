// App component - represents the whole app

/**
 * Create expiry index to remove attendands automatically
 *
 * db.attendants.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 10 } )
 *
 */

var reactiveBeaconRegion;

Attendants = new Mongo.Collection("attendants");

Meteor.startup(function(){
    if (Meteor.isCordova) {
        reactiveBeaconRegion = new ReactiveBeaconRegion({uuid: "E598E88B-CD8B-DBEB-EBBB-CEE7BDBFBE8E", identifier: "LeadWeb"});
    }
    else {
    }
});

App = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        if (Meteor.isCordova) {
            var beaconsDetected;
            if (reactiveBeaconRegion != null) {
                beaconsDetected = reactiveBeaconRegion.getBeaconRegion().beacons;
                if(beaconsDetected.length > 0) {
                    // Check it already in attendance
                    oldAttendants = Attendants.find({owner: Meteor.userId()}).fetch();
                    var alreadyAttending = oldAttendants.length > 0;
                    if(!alreadyAttending) {
                        Attendants.insert({
                            createdAt: new Date(), // current time
                            beacon: beaconsDetected[0].uuid,
                            owner: Meteor.userId(),           // _id of logged in user
                            username: Meteor.user().username  // username of logged in user
                        });
                    }
                }
            }
            return {
                beacons: beaconsDetected,
                currentUser: Meteor.user()
            }
        }
        else {
            return {
                attendants: Attendants.find({}, {sort: {createdAt: -1}}).fetch()
            }
        }
    },

    renderBeacons() {
        if(this.data.beacons !== undefined) {
            // Render beacon info
            return this.data.beacons.map((beacon) => {
                return <Beacon key={beacon.uuid} beacon={beacon} />;
            });
        }
    },

    renderAttendants() {
        return this.data.attendants.map((attendant) => {
            return <Attendant key={attendant._id} attendant={attendant} />;
        });
    },
 
    render() {
        if (Meteor.isCordova) {
            return (
                <div className="container">
                    {this.renderBeacons()}
                </div>
            );
        }
        else {
            return (
                <div className="row">
                    <div className="col s10 offset-s1">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">Attendance</span>
                            </div>
                            <div className="card-action blue-grey lighten-3">
                                <ul>
                                    {this.renderAttendants()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
});