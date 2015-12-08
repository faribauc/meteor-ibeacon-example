// Attendant component - represents a single todo item
Attendant = React.createClass({

    propTypes: {
        // This component gets the attendant to display through a React prop.
        // We can use propTypes to indicate it is required
        attendant: React.PropTypes.object.isRequired
    },

    deleteThisAttendant() {
        Attendants.remove(this.props.attendant._id);
    },

    render() {
        return (
            <li>Welcome, {this.props.attendant.username}! You arrived at {this.props.attendant.uuid}.</li>
        );
    }

});
