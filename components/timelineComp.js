import React, { Component } from "react";
import Timeline from "react-visjs-timeline";

// add items to the DataSet
/*const tlItems = [
    { id: 1, content: "item 1<br>start", start: "2014-01-10" },
    { id: 2, content: "item 2", start: "2014-01-18" },
    { id: 3, content: "item 3", start: "2014-01-21" },
    { id: 4, content: "item 4", start: "2014-01-19", end: "2014-01-24" },
    { id: 5, content: "item 5", start: "2014-01-28", type: "point" },
    { id: 6, content: "item 6", start: "2014-01-26" },
];*/

//https://visjs.github.io/vis-timeline/docs/timeline/#Configuration_Options
const tlOptions = {
    orientation: { axis: "bottom" },
    height: 250,
    // timeAxis: { scale: "day", step: 1 },
    //start: "2014-01-10",
    //end: "2014-02-10"
    //editable: true,
    //showCurrentTime: true
};

class Tl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: tlOptions,
            //items: tlItems,
            items: this.props.timelineItems,
        };
    }

    componentDidMount() {
        //console.log(this.tl);

        const timeline = this.tl.$el;

        //timeline.focus(this.props.focusItemId);

        timeline.on(
            "rangechanged",
            function (properties) {
                /*fetch("https://mocki.io/v1/7c3f8734-6e97-4eb8-863a-f271d9e5f6fd")
          .then((response) => response.json())
          .then((data) => this.setState({ items: data.data }));
        console.log("range changed", properties);*/
                //this.logEvent("rangechanged", properties);
                console.log("range changed", properties);
                this.props.setRange([properties.start, properties.end]);
            }.bind(this)
        );

        timeline.on(
            "select",
            function (properties) {
                console.log("select ", properties);
                //this.props.setSelectedItem(properties.items);
                //this.logEvent("select", properties);ss
                //this.props.setSelectedArticle(properties.items[0]);
                this.props.onItemSelect(properties.items[0]);
            }.bind(this)
        );
    }

    render() {
        const { items, options } = this.state;
        return (
            <div>
                <Timeline
                    ref={(node) => (this.tl = node)}
                    options={options}
                    items={this.props.timelineItems}
                />
            </div>
        );
    }
}

export default Tl;
