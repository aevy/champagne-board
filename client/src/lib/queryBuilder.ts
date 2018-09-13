const buildQueryFromObj = (obj: any, connect = "AND") => {
  const keys = Object.keys(obj);
  const str: string = keys
    .map(k => {
      if (k === "OR") {
        return `(${buildQueryFromObj(obj[k], "OR")})`;
      } else if (k === "AND") {
        return `(${buildQueryFromObj(obj[k], "AND")})`;
      } else {
        return `${k}:${obj[k]}`;
      }
    })
    .join(` ${connect} `);
  return str;
};

export type TimelionMetric = "avg" | "sum";

class QueryBuilder {
  private index: string;
  private splitString?: string;
  private cusum = false;
  private queryString: string;
  private metricString: string;
  constructor(index?: string) {
    this.index = index || "metrics*";
  }

  static create(index?: string) {
    return new QueryBuilder(index);
  }

  split(field: string, maxfields?: number) {
    this.splitString = `split=${field}:${maxfields || 10}`;
    return Object.assign(QueryBuilder.create(), this);
  }

  cummulative(c?: boolean) {
    this.cusum = c === undefined ? true : c;
    return Object.assign(QueryBuilder.create(), this);
  }

  query(q: object) {
    this.queryString = `q="${buildQueryFromObj(q)}"`;
    return Object.assign(QueryBuilder.create(), this);
  }

  metric(m: TimelionMetric, path: string[]) {
    this.metricString = `metric=${m}:${path.join(".")}`;
    return Object.assign(QueryBuilder.create(), this);
  }

  private getEsString() {
    const indexString = `index=${this.index}`;
    const esString = [
      indexString,
      this.splitString,
      this.queryString,
      this.metricString
    ]
      .filter(Boolean)
      .join(", ");
    return `.es(${esString})`;
  }

  private getAppendString() {
    const cusumString = this.cusum && ".cusum()";
    return [cusumString].filter(Boolean).join("");
  }
  build() {
    return this.getEsString() + this.getAppendString();
  }

  toString() {
    return this.build();
  }
}

export default QueryBuilder;
