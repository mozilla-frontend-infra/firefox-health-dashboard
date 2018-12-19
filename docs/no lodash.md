
# Don't import Lodash?

## The argument

I found it difficult to understand why `import _ from 'lodash';` got strong rejection from my peers:

https://github.com/mozilla-frontend-infra/firefox-health-dashboard/pull/233#discussion_r241036252
https://github.com/mozilla-frontend-infra/firefox-health-dashboard/pull/233#discussion_r241915232
https://github.com/mozilla-frontend-infra/firefox-health-dashboard/pull/233#discussion_r242160214

The main argument they gave was

> only import what you need, so that "tree shaking" can minimize the size of the executable

But this logic was not good answer for me:

1. I **am** including only what I needed: specifically, `chain()`, which demands all of Lodash get imported.
2. Without `chain()` I must implement the same functionality myself, which is more code, and probably slower code. 
3. Looking at [the Lodash site](https://lodash.com/), it was "only" 24kb to download. It seemed to be a small library.
4. Lodash is already included, via dependencies, over 40 times, what's the chance Lodash is not already included?
5. `import Grid from '@material-ui/core/Grid'` is just fine ([link](https://github.com/mozilla-frontend-infra/firefox-health-dashboard/pull/233#discussion_r242165492)) - If size is an issue, then we should be looking at each import and how it affects the size of the final executable: Importing "only what we need" from one library may be much larger than import everything from another.

## Analysis


Then let's measure!

> Please note: All directory listing are partial listings; including only the relevant files.

Here is my branch, with no Lodash (https://github.com/mozilla-frontend-infra/firefox-health-dashboard/tree/2efe48fe8d6a8759fccfde70b02578383f765486)

<pre>
 Directory of C:\Users\kyle\code\firefox-health-dashboard\build\assets

2018-12-19  09:14    &lt;DIR>          .
2018-12-19  09:14    &lt;DIR>          ..
2018-12-19  09:14            20,558 1.57c6c4a5.css
2018-12-19  09:14            26,925 1.57c6c4a5.css.map
2018-12-19  09:14         1,394,782 1.5bfd5b75.js
2018-12-19  09:14         6,340,128 1.5bfd5b75.js.map
2018-12-19  09:14            80,305 index.c6516772.js
2018-12-19  09:14           231,843 index.c6516772.js.map
2018-12-19  09:14            40,410 index.ceb1cad6.css
2018-12-19  09:14            51,444 index.ceb1cad6.css.map
2018-12-19  09:14             1,495 runtime.1ca11f96.js
2018-12-19  09:14             7,996 runtime.1ca11f96.js.map
              34 File(s)      8,638,330 bytes
               2 Dir(s)  186,659,311,616 bytes free
</pre>

Here is an older version, it does the same, but using Lodash (https://github.com/mozilla-frontend-infra/firefox-health-dashboard/tree/907082170bb1b4c1b83f2ec6d84a959a89402e2b)

<pre>
 Directory of C:\Users\kyle\code\firefox-health-dashboard\build\assets

2018-12-19  09:24    &lt;DIR>          .
2018-12-19  09:24    &lt;DIR>          ..
2018-12-19  09:24            20,558 1.57c6c4a5.css
2018-12-19  09:24            26,925 1.57c6c4a5.css.map
2018-12-19  09:24         1,460,795 1.677b9c70.js
2018-12-19  09:24         6,975,948 1.677b9c70.js.map
2018-12-19  09:24            79,849 index.309df229.js
2018-12-19  09:24           230,833 index.309df229.js.map
2018-12-19  09:24            41,867 index.7572632c.css
2018-12-19  09:24            53,273 index.7572632c.css.map
2018-12-19  09:24             1,495 runtime.1ca11f96.js
2018-12-19  09:24             7,996 runtime.1ca11f96.js.map
              34 File(s)      9,341,983 bytes
               2 Dir(s)  186,649,624,576 bytes free
</pre>

Wait. What!?  **An additional 636Kb for Lodash?!**  That is a unbelievable increase. Obviously something is wrong.

Maybe that comparison is not fair: The two programs are not the same. Let me try the same program, with all the Lodash imports removed.  The application will not work, but at least I can see what the size differential is without Lodash:

<pre>
 Directory of C:\Users\kyle\code\firefox-health-dashboard\build\assets

2018-12-19  09:40    &lt;DIR>          .
2018-12-19  09:40    &lt;DIR>          ..
2018-12-19  09:40            20,558 1.57c6c4a5.css
2018-12-19  09:40            26,925 1.57c6c4a5.css.map
2018-12-19  09:40         1,390,059 1.d48a3844.js
2018-12-19  09:40         6,299,868 1.d48a3844.js.map
2018-12-19  09:40            41,867 index.7572632c.css
2018-12-19  09:40            53,273 index.7572632c.css.map
2018-12-19  09:40            79,234 index.841c4b52.js
2018-12-19  09:40           229,981 index.841c4b52.js.map
2018-12-19  09:40             1,495 runtime.1ca11f96.js
2018-12-19  09:40             7,996 runtime.1ca11f96.js.map
              34 File(s)      8,593,700 bytes
               2 Dir(s)  186,605,813,760 bytes free
</pre>

Confirmed.  **It seems Lodash increases the size of the app by 676Kb!**  The "something wrong" was my understanding of the size of Lodash.  What is the size of Lodash?

<pre>
 Directory of C:\Users\kyle\AppData\Roaming\npm\node_modules\webpack\node_modules\lodash

2017-04-19  12:27    &lt;DIR>          .
2017-04-19  12:27    &lt;DIR>          ..
2017-04-19  12:27           539,590 lodash.js
</pre>

Oh. so the "24kb download" was **very** well compressed.

## Conclusion

In conclusion, `import _ from 'lodash'` can increase the size of your executable greatly.

## Retrospective

It is sad that `chain()` is expensive to import. Lodash works around the size problem a couple of ways: First, every operation is split into its own file. Second, the `lodash/fp` flips the argument order so, instead of 

    let X = chain(A)
      .filter(B)
      .groupBy(C)
      .map(D)
      .value()

you can write

    let X = map(D, groupBy(C, filter(B, A)))

This reversed form is less elegant as function chains get longer; chaining allows one-operation-per-line, and this functional form will get messy if you have an aggressive linter:

    const X = map(
      D,
      groupBy(
        C,
        filter(
          B,
          A,
        ),
      ),
    );

You can import even less Lodash, and use `Array` functions:

    let X = groupBy(C, A.filter(B)).map(D)
 
which is even worse, since the semantic order and the logical order are now different.

The approach I went with was to wrap the array in a `Wrapper` class, and add extension methods for only the operations I actually use:

    let X = frum(A)
      .filter(B)
      .groupBy(C)
      .map(D)
      .toArray()












