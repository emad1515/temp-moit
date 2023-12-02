class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
      'department',
      'todayActivity',
      'start',
      'end',
    ];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|eq|regex)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  search() {
    if (this.queryString.search) {
      this.query.find({
        subject: { $regex: this.queryString.search, $options: 'i' },
      });
    }

    return this;
  }

  department() {
    if (this.queryString.department) {
      this.query = this.query.find({
        $or: [
          { sender: this.queryString.department },
          { receiver: this.queryString.department },
        ],
      });
    }

    return this;
  }

  todayActivity() {
    if (this.queryString.todayActivity) {
      this.query = this.query.find({
        $or: [
          { status: 'pending' },
          // {
          //   $and: [
          //     { status: 'pending' },
          //     {
          //       $and: [
          //         { createdAt: { $gte: this.queryString.start } },
          //         { createdAt: { $lte: this.queryString.end } },
          //       ],
          //     },
          //   ],
          // },
          {
            $and: [
              { status: 'processing' },
              {
                $and: [
                  { endDate: { $gte: this.queryString.start } },
                  { endDate: { $lte: this.queryString.end } },
                ],
              },
            ],
          },
        ],
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 0;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
