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
  }

  async componentDidMount(){
    console.log("cdm");
    const url = "https://newsapi.org/v2/everything?q=tesla&from=2026-01-16&sortBy=publishedAt&apiKey=2fbde6c4f937469f8a851608acaddce3";

    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      console.log(parsedData);
      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0
      });
    } catch (err) {
      console.error(err);
    }
  }

previouspage = async () => {
  if (this.state.page <= 1) return;
  const newPage = this.state.page - 1;
  console.log("previous - fetching page", newPage);
  const url = `https://newsapi.org/v2/everything?q=tesla&from=2026-01-16&sortBy=publishedAt&page=${newPage}&pageSize=9&apiKey=2fbde6c4f937469f8a851608acaddce3`;

  try {
    const data = await fetch(url);
    const parsedData = await data.json();
    this.setState({
      page: newPage,
      articles: parsedData.articles || []
    });
  } catch (err) {
    console.error(err);
  }
} 

nextpage = async () => {
  const newPage = this.state.page + 1;
  console.log("next - fetching page", newPage);
  const url = `https://newsapi.org/v2/everything?q=tesla&from=2026-01-16&sortBy=publishedAt&page=${newPage}&pageSize=9&apiKey=2fbde6c4f937469f8a851608acaddce3`;

  try {
    const data = await fetch(url);
    const parsedData = await data.json();
    this.setState({
      page: newPage,
      articles: parsedData.articles || []
    });
  } catch (err) {
    console.error(err);
  }
}



  render() {
    return (
      <div className="container my-3">
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
      </div>
    )
  }
}
