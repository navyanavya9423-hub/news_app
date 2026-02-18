import React from 'react'
import Newsitem from './Newsitem'

export default class News extends React.Component {

  constructor(props){
    super(props)
    console.log("hello i am a constructor from news component")
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    this.apiKey = process.env.REACT_APP_NEWS_API_KEY || '70442fe3aec54043852b5299650a22f1'
  }

  getFromDate = () => {
    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    return fromDate.toISOString().split('T')[0];
  }

  fetchNews = async (page = 1) => {
    this.setState({ loading: true });
    const pageSize = 20
    const fromDateStr = this.getFromDate();
    
    const url = `https://newsapi.org/v2/everything?q=tesla&from=${fromDateStr}&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      console.log("API Response:", parsedData);
      
      if (parsedData.articles && parsedData.articles.length > 0) {
        const articlesWithImages = parsedData.articles.filter(article => article.urlToImage);
        this.setState({ 
          articles: articlesWithImages.length > 0 ? articlesWithImages : parsedData.articles, 
          page, 
          loading: false,
          totalResults: parsedData.totalResults || 0
        });
      } else {
        console.warn("No articles found in response");
        this.setState({ articles: [], page, loading: false });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      this.setState({ loading: false });
    }
  }

  async componentDidMount(){
    console.log("cdm");
    this.fetchNews(1);
  }

  previouspage = async () => {
    console.log("Previous button clicked");
    if (this.state.page <= 1) return;
    const prevPage = Math.max(1, this.state.page - 1);
    console.log("previous - fetching page", prevPage);
    this.fetchNews(prevPage);
  } 

  nextpage = async () => {
    console.log("Next button clicked");
    const newPage = this.state.page + 1;
    console.log("next - fetching page", newPage);
    this.fetchNews(newPage);
  }



  render() {
    return (
      <div className="container my-3">
        {this.state.loading && <p className="text-center">Loading news...</p>}
        {this.state.articles.length > 0 && (
          <>
            <h1 className="text-center"> My News Top Headlines</h1>
            <div className="row">
              {this.state.articles.map(element => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <Newsitem
                      title={element.title? element.title.slice(0, 50) : ""}
                      description={element.description ? element.description.slice(0, 88) : ""}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                    />
                  </div>
                )
              })}
            </div>
            <div className="container d-flex justify-content-between">
              <button
                disabled={this.state.page <= 1}
                type="button"
                className="btn btn-dark"
                onClick={this.previouspage}
              >
                &larr; Previous
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={this.nextpage}
              >
                Next &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    )
  }
}