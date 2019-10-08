export function determineIQR(inputArray) {

    let dataArray = inputArray
    dataArray.sort(function(a,b){return a.count-b.count})
  
    const getMedian = (dataset) => {
      let middleIndex
      let median
      if (dataset.length % 2 == 0) {
        middleIndex = dataset.length/2
        let middleIndex2 = middleIndex - 1
        median = (dataset[middleIndex].count + dataset[middleIndex2].count)/2
      } else {
        middleIndex = Math.trunc(dataset.length / 2)
        median = dataset[middleIndex].count
      }
      return [middleIndex, median]
    }
  
    const getArrayHalves = (dataArray, middleIndex) => {
      let lesserArray
      let greaterArray
      if (dataArray.length % 2 == 0) {
        lesserArray = dataArray.slice(0,middleIndex)
        greaterArray = dataArray.slice(middleIndex,dataArray.length)
      } else {
        lesserArray = dataArray.slice(0,middleIndex)
        greaterArray = dataArray.slice(middleIndex+1,dataArray.length)
      }
      return [lesserArray, greaterArray]
    }
  
    const fullMiddleIndex = getMedian(dataArray)[0]
    const lesserHalfArray = getArrayHalves(dataArray, fullMiddleIndex)[0]
    const greaterHalfArray = getArrayHalves(dataArray, fullMiddleIndex)[1]
    const lesserMiddleIndex = getMedian(lesserHalfArray)[0]
    const lesserMedian = getMedian(lesserHalfArray)[1]
    const greaterMiddleIndex = getMedian(greaterHalfArray)[0]
    const greaterMedian = getMedian(greaterHalfArray)[1]
  
    let quartileOneArray = []
    let quartileTwoArray = []
    let quartileThreeArray = []
  
    dataArray.forEach(datum => {
      if (datum.count < lesserMedian) {
        quartileOneArray.push(datum)
      } else if (datum.count >= lesserMedian && datum.count <= greaterMedian) {
        quartileTwoArray.push(datum)
      } else if (datum.count > greaterMedian) {
        quartileThreeArray.push(datum)
      }
    })
  
    return {quartileOneArray, quartileTwoArray, quartileThreeArray}
  
  }