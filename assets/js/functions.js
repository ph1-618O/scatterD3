
//On click update Axis scale
function xScaler(data, selectXAxis) {
    let xLinear =   
                    d3.scaleLinear().domain([d3.min(data, d => d[selectXAxis])* 0.9,
                    d3.max(data, d => d[selectXAxis]) *1.1])
                    .range([0, width]);
                return xLinear;
            }

function yScaler(data, selectYAxis){
    let yLinear = 
                    d3.scaleLinear().domain([d3.min(data, d => d[selectYAxis]) -1,
                    d3.max(data, d => d[selectYAxis]) + 1])
                    .range([height, 0]);
                return yLinear;

            }

//Update Axes on click
function renderX(nextXScale, xAxis){
    let lowerAxis = d3.axisBottom(nextXScale);
    xAxis.transition()
            .duration(1000)
            .call(lowerAxis);
    return xAxis;
}

function renderY(nextYScale, yAxis){
    let upperAxis = d3.axisLeft(nextYScale);
    yAxis.transition()
            .duration(1000)
            .call(upperAxis);
    return yAxis;
}
//Update Points
function renderXPoints(pointsGroup, nextXScale, selectXAxis){
    pointsGroup.transition()
                .duration(1000)
                .attr('cx', d => nextXScale(d[selectXAxis]));
    return pointsGroup
}

function renderYPoints(pointsGroup, nextYScale, selectYAxis){
    pointsGroup.transition()
                .duration(1000)
                .attr('cy', d => nextYScale(d[selectYAxis]));
    return pointsGroup
}


//Render Text

function xText(pointsGroup, nextXScale, selectXAxis){
    pointsGroup.transition()
                .duration(1000)
                .attr('dx', d => nextXScale(d[selectXAxis]));
    return pointsGroup;
}

function yText(pointsGroup, nextYScale, selectYAxis){
    pointsGroup.transition()
                .duration(1000)
                .attr('dy', d => nextYScale(d[selectYAxis])+5);
    return pointsGroup;
}

//changing int to dollar format
let usCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

function updateToolTip(pointsGroup, selectXAxis, selectYAxis) {

    let xPercent = "";
    let xLabel = "";
    if (selectXAxis === 'lowerIncome'){
        xLabel = 'Lower Income';
        xPercent = '%';
    } else if (selectXAxis === 'age'){
        xLabel = 'Age';
    } else {
        xLabel = 'Income';
    }

    let yPercent = "";
    let yLabel = "";
    if (selectYAxis === 'healthcare'){
        yLabel = 'Health care';
        yPercent = '%';
    } else if (selectYAxis === 'smokers'){ 
        yLabel = 'Smoker';
        yPercent = '%';
    } else {
        yLabel = 'overWeight';
        yPercent = '%';
    }
    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([50, -75])
        .html(function (d){
            if (selectXAxis === 'income'){
                let incomeLevel = usCurrency.format(d[selectXAxis]);
                return (`${d.state}<br>${xLabel}: ${incomeLevel.substring(0, incomeLevel.length-3)}${xPercent}<br>${yLabel}: ${d[selectXAxis]}${yPercent}`)
            }  else {
                return(`${d.state}<br>${xLabel}: ${d[selectYAxis]}${xPercent}<br>${yLabel}: ${d[selectYAxis]}${yPercent}`)
            };

        });
    pointsGroup.call(toolTip);

    pointsGroup.on('mouseover', function (thisData){
        toolTip.show(thisData, this);
    })
    .on('mouseout', function (thisData){
        toolTip.hide(thisData, this);
    });

    return pointsGroup;
}