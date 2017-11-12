/**
 *
 * Demo page script here
 *
 */


// Mock data from Apple iOS Store RSS
import topFreeData from './data/top-free-non-explicit.js'
import topPaidData from './data/top-paid-non-explicit.js'


console.log('this is loaded final');


const topFreeSuggestionData = convertDataAppStoreRSS(topFreeData);
const topPaidSuggestionData = convertDataAppStoreRSS(topPaidData);

const sgInstanceAppstoreTopFree1 = new Suggestion('sg-appstore-top-free1', topFreeSuggestionData);
const sgInstanceAppstoreTopPaid1 = new Suggestion('sg-appstore-top-paid1', topPaidSuggestionData);
const sgInstanceAppstoreTopPaid2 = new Suggestion('sg-appstore-top-paid2', topPaidSuggestionData);


/**
 * Convert raw data from API/mock of Apple iOS Store RSS to Suggestion plugin data structure
 * See more at README.md
 *
 * @param rawData
 * @returns {{}}
 */
function convertDataAppStoreRSS(rawData) {
  const results = rawData.feed.results;
  const data = {};
  
  for (let v of results) {
    data[v.id] = {
      id: v.id.toString(),
      icon: v.artworkUrl100,
      name: v.name,
    }
  }
  
  return data;
}