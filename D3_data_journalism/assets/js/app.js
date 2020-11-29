const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};


const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 40);

const scatterGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let selectXAxis = 'poverty'
let selectYAxis = 'healthcare';

(async function(){
    const data = await d3.csv("assets/data/data.csv");

    data.forEach(function(point){
        point.poverty = +point.poverty;
        point.healthcare = +point.healthcare;
        point.age = +point.age;
        point.smokes = +point.smokes;
        point.obesity = +point.obesity;
        point.income = +point.income;
    });

    let xLinear = xScaler(data, selectXAxis);
    let yLinear = yScaler(data, selectYAxis);

    let lowerAxis = d3.axisBottom(xLinear);
    let leftSide = d3.axisLeft(yLinear);

    let xAxis = scatterGroup.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(lowerAxis);

    let yAxis = scatterGroup.append("g")
        .call(leftSide);

    let pointsGroup = scatterGroup.selectAll("g circle")
        .data(data)
        .enter()
        .append("g");

    let pointsXY = pointsGroup.append('circle')
    .attr("cx", d=> xLinear(d[selectXAxis]))
    .attr("cy", d=> yLinear(d[selectYAxis]))
    .attr('r', 15)
    .classed('stateCircle', true);

    let pointsText = pointsGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinear(d[selectXAxis]))
        .attr("dy", d => yLinear(d[selectYAxis]) + 5)
        .classed("stateText", true);

const xLabels = scatterGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);
    
    const lowerIncomeLabel = xLabels.append('text')
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .text("Lower Income (%)")
        .classed('active', true);
        
    const ageLabel = xLabels.append('text')
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .text("Average Age")
        .classed('inactive', true);

    const incomeLabel = xLabels.append('text')
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .text("Median Household Income")
        .classed('inactive', true);    

const yLabels = scatterGroup.append('g');

    const healthLabel = yLabels.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2))
        .attr('y', -40)
        .attr('value', 'healthcare')
        .text('No Healthcare (%)')
        .classed('active', true);

    const smokerLabel = yLabels.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2))
        .attr('y', -60)
        .attr('value', 'smokes')
        .text('Smokers (%)')
        .classed('inactive', true);

    const overweightLabel = yLabels.append('text')
        .attr('transform', "rotate(-90)")
        .attr('x', -(height / 2))
        .attr ('y', -80)
        .attr('value', 'obesity')
        .text("Overweight (%)")
        .classed('inactive', true)

pointsGroup = updateToolTip(pointsGroup, selectXAxis, selectYAxis);

    xLabels.selectAll('text')
        .on('click', function(){
            const value = d3.select(this).attr('value');
            if (value !== selectXAxis){
                selectXAxis = value;
                xLinear = xScaler(data, selectXAxis);
                xAxis = renderX(xLinear, xAxis);
                pointsXY = renderXPoints(pointsXY, xLinear, selectXAxis);
                pointsText = xText(pointsText, xLinear, selectXAxis);
                pointsGroup = updateToolTip(pointsGroup, selectXAxis, selectYAxis);

                if (selectXAxis == 'age'){
                    lowerIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (selectXAxis == 'income') {
                    lowerIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                } else {
                    lowerIncomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
            }
        });

        yLabels.selectAll('text')
        .on('click', function(){
            const value = d3.select(this).attr('value');
            if (value !== selectYAxis){
                selectYAxis = value;
                yLinear = yScaler(data, selectYAxis);
                yAxis = renderY(yLinear, yAxis);
                pointsXY = renderYPoints(pointsXY, yLinear, selectYAxis);
                pointsText = yText(pointsText, yLinear, selectYAxis);
                pointsGroup = updateToolTip(pointsGroup, selectXAxis, selectYAxis);

                if (selectYAxis == 'smokes'){
                    healthLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokerLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    overweightLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (selectYAxis == 'obesity') {
                    healthLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokerLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    overweightLabel
                    .classed('active', true)
                    .classed('inactive', false);
                } else {
                    healthLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    smokerLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    overweightLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
                }
        });

})()