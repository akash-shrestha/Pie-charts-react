import React from "react";
import { PieChart, Pie } from "recharts";

export default class PieChartCom extends React.Component {
  state = {
    loading: true,
    data: null
  };

  async componentDidMount() {
    const organizationsUrl = "https://mdsa.bipad.gov.np/api/v1/organization";
    const projectsUrl = "https://mdsa.bipad.gov.np/api/v1/project";

    const organizationsUrlRes = await fetch(organizationsUrl);
    const projectsUrlRes = await fetch(projectsUrl);
    const organizationsUrlResData = await organizationsUrlRes.json();
    const projectsUrlResData = await projectsUrlRes.json();

    const data = [];

    organizationsUrlResData.results.forEach((o) => {
      let count = 0;
      projectsUrlResData.results.forEach((p) => {
        if (o.oid === p.oid) {
          count = count + 1;
        }
      });
      if (count >= 1) {
        let dataElement = {};
        dataElement[o.oname] = count;
        dataElement.name = o.oname;
        dataElement.value = count;
        dataElement.fill =
          "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
        data.push(dataElement);
      }
    });

    this.setState({ data: data, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    if (!this.state.data) {
      return <div>Failed to get data, Please try again !</div>;
    }

    const style = {
      "margin-left": "30px"
    };

    return (
      <div>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={this.state.data}
            cx={200}
            cy={200}
            outerRadius={80}
            label
          />
        </PieChart>
        <div>
          {this.state.data.map(function (data, i) {
            console.log("fil", data.fill);
            const divStyle = {
              float: "left",
              height: "20px",
              width: "20px",
              marginbottom: "15px",
              clear: "both"
            };

            divStyle.backgroundColor = data.fill;
            return (
              <div style={style}>
                <br />
                <div style={divStyle} key={i}></div>
                {data.name}
              </div>
            );
          })}
          <br />
          <hr />
        </div>
      </div>
    );
  }
}
