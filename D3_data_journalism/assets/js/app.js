const scatterWidth = 960;
const scatterHeight = 500;

const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
};


const width = scatterWidth - margin.left - margin.right;
const height = scatterHeight - margin.top - margin.bottom;


const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", scatterWidth)
    .attr("height", scatterHeight + 40);

const scatterGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let selectXAxis = 'poverty'
let selectYAxis = 'healthcare';

(async function(){
    const data = await d3.csv("../assets/data/data.csv");

    data.forEach(function(point){
        point.poverty = +point.poverty;
        point.healthcare = +point.healthcare;
        point.age = +point.age;
        point.smokes = +point.smokes;
        point.obesity = +point.obesity;
        point.income = +point.income;
    });

    let xLinear = xScale(data, selectXAxis);
    let yLinear = yScale(data, selectYAxis);

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

    let pointText = pointsGroup.append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinear(d[selectXAxis]))
        .attr("dy", d => xLinear(d[selectYAxis]) + 5)
        .classed("stateText", true);

const xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height})`);
    
    const lowerIncomeLabel = xLabels.append('text')
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .text("% Poverty")
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
        .attr('x', -(height/2))
        .attr('y', -60)
        .attr('value', 'healthcare')
        .text('No Healthcare (%)')
        .classed('active', true);

    const smokerLabel = yLabels.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height/2))
        .attr('y', -60)
        .attr('value', 'smokers')
        .text('Smokers (%)')
        .classed('inactive', true);

    const overweightLabel = yLabels.append('text')
        .attr('transform', "rotate(-90)")
        .attr('x', -(height / 2))
        .attr ('y', -80)
        .attr('value', 'obesity')
        .text("Overweight %")
        .classed('inactive', true)

pointsGroup = updateToolTip(pointsGroup, selectXAxis, selectYAxis);

    xLabels.selectAll('text')
        .on('click', function(){
            const value = d3.select(this).attr('value');
            if (value !== selectXAxis){
                selectXAxis = value;
                xLinear = xScale(data, selectXAxis);
                xAxis = renderXAxes(xLinear, xAxis);
                pointXY = renderXCircles(pointXY, xLinear, selectXAxis);
                pointsText = renderXText(pointsText, XLinear, selectXAxis);
                pointsGroup = updateToolTop(pointsGroup, selectXAxis, selectYAxis);

                if (selectXAxis == 'age'){
                    lowerIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                } else if (selectXAxis == 'income') {
                    lowerIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else {
                    lowerIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
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
                yLinear = xScale(data, selectYAxis);
                yAxis = renderXAxes(yLinear, yAxis);
                pointXY = renderXCircles(pointXY, yLinear, selectYAxis);
                pointsText = renderXText(pointsText, yLinear, selectYAxis);
                pointsGroup = updateToolTop(pointsGroup, selectXAxis, selectYAxis);

                if (selectXAxis == 'smokes'){
                    healthLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokerLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    overweightLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (selectXAxis == 'income') {
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

})