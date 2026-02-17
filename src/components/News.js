import React from 'react'
import Newsitem from './Newsitem'

export default class News extends React.Component {

  constructor(props){
    super(props)
    console.log("hello i am a constructor from news component")
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
  }
  fetchNews = async (page = 1) => {
    this.setState({ loading: true });
    const pageSize = 20;
    const url = `https://newsapi.org/v2/everything?q=tesla&from=2026-01-16&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=70442fe3aec54043852b5299650a22f1`;

    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      this.setState({ articles: parsedData.articles || [], page, loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  async componentDidMount(){
    this.fetchNews(1);
  }

  previousPage = async () => {
    const prevPage = Math.max(1, this.state.page - 1);
    await this.fetchNews(prevPage);
  }

  nextPage = async () => {
    const nextPage = this.state.page + 1;
    await this.fetchNews(nextPage);

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
                  title={element.title}
                  description={element.description}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                />
              </div>
            )
          })}
        </div><div className="d-flex justify-content-center gap-3 mt-5">
          <button disabled={this.state.page <= 1} type="button" onClick={this.previousPage} className="btn btn-dark">&larr; Previous</button>
          <button type="button" onClick={this.nextPage} className="btn btn-dark">Next &rarr;</button>
      </div>
      </div>
    )
  }
}