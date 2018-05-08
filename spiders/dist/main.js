'use strict';

const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const async = require('async');

charset(superagent);

class Spider_17 {
    /**
     * 构造函数
     * @param options:{page：抓取页数, limit：并发数}
     */
    constructor(options) {
        const defaultOpts = {
            page: 1,
            limit: 5
        };
        let opts = defaultOpts;
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }
        this.page = opts.page;
        this.limit = opts.limit;
    }

    /**
     * 获取详情页数据
     * @param url
     * @returns {Promise<{song_name: *, author_name: T.author_name, song_poster: T.song_poster, chord_images: jQuery[], query: *, view_count: number, collect_count: number, search_count: number}>}
     * @private
     */
    async _fetchDetail(url, cb) {
        const res = await superagent
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('h1.ph').text();
        const song_name = this._analyseTitle(title);
        let song_poster;
        let author_name;
        try {
            const songInfo = await this._getSongInfo(song_name);
            song_poster = songInfo.song_poster;
            author_name = songInfo.author_name;
            console.log(author_name, 1111111);
        } catch (err) {
            cb(null);
            return;
        }
        const query = song_name;
        const imgs = Array.prototype.slice.call($('#article_contents img'));
        const chord_images = imgs.map((el) => {
            return $(el).attr('src');
        });
        const view_count = 0;
        const collect_count = 0;
        const search_count = 0;
        const data = {
            song_name,
            author_name,
            song_poster,
            chord_images,
            query,
            view_count,
            collect_count,
            search_count
        };
        typeof cb === 'function' && cb(null, data);
        console.log(`$$结束抓取${url}$$`);
    }

    /**
     * 调网易API获取歌曲封面、歌手
     * @param name
     * @returns {Promise<T>}
     * @private
     */
    async _getSongInfo(name) {
        return await superagent
            .post('http://music.163.com/api/search/pc')
            .type('form')
            .send({
                s: name,
                type: '1'
            }).then(res => {
                res = JSON.parse(res.text);
                const songs = res.result && res.result.songs;
                if (songs && songs.length) {
                    return {
                        song_poster: songs[0].album.picUrl,
                        author_name: songs[0].artists[0].name
                    }
                } else {
                    return {song_poster: '', author_name: ''}
                }
            }).catch(err => {
                console.log(err);
            });
    }

    /**
     * 分析title字段提取歌曲名
     * @param title
     * @returns {*|string}
     * @private
     */
    _analyseTitle(title) {
        const regExp = [
            /\《([\S]+)\》/,
            /([\w\W]+)吉他谱/
        ];
        let match = title.match(regExp[0]);
        if (match) {
            return match[1] || ''
        } else {
            match = title.match(regExp[1]);
            return match && match[1] || ''
        }
    }

    /**
     * 获取列表url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async fetchList() {
        const url = 'https://www.17jita.com/tab/index.php';
        const detailPageUrls = await this._analyseList(url, this.page);
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    async fetchTop100List() {
        const url = 'https://www.17jita.com/tab/topic/top100.html';
        const detailPageUrls = await this._analyseTop100List(url);
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    /**
     * 分析单页列表页从而获取详情页urls
     * @param url 列表页url
     * @param page
     * @returns {Promise<Array>}
     * @private
     */
    async _analyseList(url, page) {
        let result = [];
        for (let i = 1; i <= page; i++) {
            url = `${url}?page=${i}`;
            const res = await
                superagent
                    .get(url)
                    .charset('gbk');
            const html = res.text;
            const $ = cheerio.load(html);
            $('.bbs.cl .xs3 a').each((index, el) => {
                const id = $(el).attr('href').match(/\d+/);
                const href = `https://www.17jita.com/tab/whole_${id}.html`;
                result.push(href);
            });
        }
        return result;
    }

    /**
     * 分析top100列表页从而获取详情页urls
     * @param url top100列表页url
     * @returns {Promise<Array>}
     * @private
     */
    async _analyseTop100List(url) {
        let result = [];
        const res = await
            superagent
                .get(url)
                .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        $('#article_content ul li').each((index, el) => {
            const id = $(el).find('a').eq(1).attr('href').match(/\d+/);
            const href = `https://www.17jita.com/tab/whole_${id}.html`;
            result.push(href);
        });
        return result;
    }

}

const superagent$1 = require('superagent');
const charset$1 = require('superagent-charset');
const cheerio$1 = require('cheerio');
const async$1 = require('async');

charset$1(superagent$1);


class Spider_cc {
    constructor(options) {
        const defaultOpts = {
            page: 1,
            limit: 5
        };
        let opts = defaultOpts;
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }
        this.page = opts.page;
        this.limit = opts.limit;
    }

    init() {
        console.log('Spidercc.js');
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        return new Promise((resolve, reject) => {
            async$1.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    async _fetchDetailLinks(queryString) {
        queryString = queryString.replace(/'|"/ig, "");
        queryString = escape(queryString);
        let urls = [];
        let result = [];
        for (let i = 1; i <= this.page; i++) {
            const url = `http://so.ccguitar.cn/tosearch.aspx?searchtype=1&ls=n545c48d898&shows=0&pu_type=0&currentPage=${i}&searchname=${queryString}`;
            urls.push(url);
        }
        return new Promise((resolve, reject) => {
            async$1.mapLimit(urls, this.limit, (url, cb) => {
                this._analyseSearchLinks(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data.forEach(urls => {
                        result = result.concat(urls);
                    });
                    resolve(result);
                }
            });
        })
    }

    async _analyseSearchLinks(url, cb) {
        let result = [];
        const res = await superagent$1
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio$1.load(html);
        const total = $("#xspace-itemreply").find(".list_searh").length;
        if (!total) {
            typeof cb === 'function' && cb(null);
        } else {
            $(".list_searh .pu_title .search_url a").each((index, el) => {
                const href = $(el).attr('href');
                result.push(href);
            });
            typeof cb === 'function' && cb(null, result);
        }
    }

    async _fetchDetail(url, cb) {
        const res = await superagent$1
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio$1.load(html);
        const title = $('#navigation p').text();
        const {song_name, author_name} = this._analyseTitle(title);
        /*typeof cb === 'function' && cb(null, song_name);
        return;*/
        let song_poster;
        try {
            const songInfo = await this._getSongInfo(song_name);
            song_poster = songInfo.song_poster;
        } catch (err) {
            cb(null);
            return;
        }
        const query = song_name;
        let chord_images = [];
        $(".swiper-container .swiper-slide img").each((index, img) => {
            if (index != 0 || index != len) {
                chord_images.push('http://www.ccguitar.cn' + $(img).attr('src'));
            }
        });
        const view_count = 0;
        const collect_count = 0;
        const search_count = 0;
        const data = {
            song_name,
            author_name,
            song_poster,
            chord_images,
            query,
            view_count,
            collect_count,
            search_count
        };
        typeof cb === 'function' && cb(null, data);
        console.log(`$$结束抓取${url}$$`);
    }

    _analyseTitle(title) {
        return {
            author_name: title.split('>>')[2] || '',
            song_name:title.split('>>')[3] || ''
        }
    }

    async _getSongInfo(name) {
        return await superagent$1
            .post('http://music.163.com/api/search/pc')
            .type('form')
            .send({
                s: name,
                type: '1'
            }).then(res => {
                res = JSON.parse(res.text);
                const songs = res.result && res.result.songs;
                if (songs && songs.length) {
                    return {
                        song_poster: songs[0].album.picUrl,
                        author_name: songs[0].artists[0].name
                    }
                } else {
                    return {song_poster: '', author_name: ''}
                }
            }).catch(err => {
                console.log(err);
            });
    }

}

// a();

module.exports = {
    Spider_17,
    Spider_cc
};
