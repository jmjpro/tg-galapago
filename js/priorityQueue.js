( f u n c t i o n ( )   { 
 
     / * * 
 
       *   @ p r i v a t e 
 
       * / 
 
     v a r   p r i o r i t y S o r t L o w   =   f u n c t i o n ( a ,   b )   { 
 
         r e t u r n   b . p r i o r i t y   -   a . p r i o r i t y ; 
 
     } ; 
 
 
 
     / * * 
 
       *   @ p r i v a t e 
 
       * / 
 
     v a r   p r i o r i t y S o r t H i g h   =   f u n c t i o n ( a ,   b )   { 
 
         r e t u r n   a . p r i o r i t y   -   b . p r i o r i t y ; 
 
     } ; 
 
 
 
     / * g l o b a l   P r i o r i t y Q u e u e   * / 
 
     / * * 
 
       *   @ c o n s t r u c t o r 
 
       *   @ c l a s s   P r i o r i t y Q u e u e   m a n a g e s   a   q u e u e   o f   e l e m e n t s   w i t h   p r i o r i t i e s .   D e f a u l t 
 
       *   i s   h i g h e s t   p r i o r i t y   f i r s t . 
 
       * 
 
       *   @ p a r a m   [ o p t i o n s ]   I f   l o w   i s   s e t   t o   t r u e   r e t u r n s   l o w e s t   f i r s t . 
 
       * / 
 
     P r i o r i t y Q u e u e   =   f u n c t i o n ( o p t i o n s )   { 
 
         v a r   c o n t e n t s   =   [ ] ; 
 
 
 
         v a r   s o r t e d   =   f a l s e ; 
 
         v a r   s o r t S t y l e ; 
 
 
 
         i f ( o p t i o n s   & &   o p t i o n s . l o w )   { 
 
             s o r t S t y l e   =   p r i o r i t y S o r t L o w ; 
 
         }   e l s e   { 
 
             s o r t S t y l e   =   p r i o r i t y S o r t H i g h ; 
 
         } 
 
 
 
         / * * 
 
           *   @ p r i v a t e 
 
           * / 
 
         v a r   s o r t   =   f u n c t i o n ( )   { 
 
             c o n t e n t s . s o r t ( s o r t S t y l e ) ; 
 
             s o r t e d   =   t r u e ; 
 
         } ; 
 
 
 
         v a r   s e l f   =   { 
 
             / * * 
 
               *   R e m o v e s   a n d   r e t u r n s   t h e   n e x t   e l e m e n t   i n   t h e   q u e u e . 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ r e t u r n   T h e   n e x t   e l e m e n t   i n   t h e   q u e u e .   I f   t h e   q u e u e   i s   e m p t y   r e t u r n s 
 
               *   u n d e f i n e d . 
 
               * 
 
               *   @ s e e   P r i o i r t y Q u e u e # t o p 
 
               * / 
 
             p o p :   f u n c t i o n ( )   { 
 
                 i f ( ! s o r t e d )   { 
 
                     s o r t ( ) ; 
 
                 } 
 
 
 
                 v a r   e l e m e n t   =   c o n t e n t s . p o p ( ) ; 
 
 
 
                 i f ( e l e m e n t )   { 
 
                     r e t u r n   e l e m e n t . o b j e c t ; 
 
                 }   e l s e   { 
 
                     r e t u r n   u n d e f i n e d ; 
 
                 } 
 
             } , 
 
 
 
             / * * 
 
               *   R e t u r n s   b u t   d o e s   n o t   r e m o v e   t h e   n e x t   e l e m e n t   i n   t h e   q u e u e . 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ r e t u r n   T h e   n e x t   e l e m e n t   i n   t h e   q u e u e .   I f   t h e   q u e u e   i s   e m p t y   r e t u r n s 
 
               *   u n d e f i n e d . 
 
               * 
 
               *   @ s e e   P r i o r i t y Q u e u e # p o p 
 
               * / 
 
             t o p :   f u n c t i o n ( )   { 
 
                 i f ( ! s o r t e d )   { 
 
                     s o r t ( ) ; 
 
                 } 
 
 
 
                 v a r   e l e m e n t   =   c o n t e n t s [ c o n t e n t s . l e n g t h   -   1 ] ; 
 
 
 
                 i f ( e l e m e n t )   { 
 
                     r e t u r n   e l e m e n t . o b j e c t ; 
 
                 }   e l s e   { 
 
                     r e t u r n   u n d e f i n e d ; 
 
                 } 
 
             } , 
 
 
 
             / * * 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ p a r a m   o b j e c t   T h e   o b j e c t   t o   c h e c k   t h e   q u e u e   f o r . 
 
               *   @ r e t u r n s   t r u e   i f   t h e   o b j e c t   i s   i n   t h e   q u e u e ,   f a l s e   o t h e r w i s e . 
 
               * / 
 
             i n c l u d e s :   f u n c t i o n ( o b j e c t )   { 
 
                 f o r ( v a r   i   =   c o n t e n t s . l e n g t h   -   1 ;   i   > =   0 ;   i - - )   { 
 
                     i f ( c o n t e n t s [ i ] . o b j e c t   = = =   o b j e c t )   { 
 
                         r e t u r n   t r u e ; 
 
                     } 
 
                 } 
 
 
 
                 r e t u r n   f a l s e ; 
 
             } , 
 
 
 
             / * * 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ r e t u r n s   t h e   c u r r e n t   n u m b e r   o f   e l e m e n t s   i n   t h e   q u e u e . 
 
               * / 
 
             s i z e :   f u n c t i o n ( )   { 
 
                 r e t u r n   c o n t e n t s . l e n g t h ; 
 
             } , 
 
 
 
             / * * 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ r e t u r n s   t r u e   i f   t h e   q u e u e   i s   e m p t y ,   f a l s e   o t h e r w i s e . 
 
               * / 
 
             e m p t y :   f u n c t i o n ( )   { 
 
                 r e t u r n   c o n t e n t s . l e n g t h   = = =   0 ; 
 
             } , 
 
 
 
             / * * 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ p a r a m   o b j e c t   T h e   o b j e c t   t o   b e   p u s h e d   o n t o   t h e   q u e u e . 
 
               *   @ p a r a m   p r i o r i t y   T h e   p r i o r i t y   o f   t h e   o b j e c t . 
 
               * / 
 
             p u s h :   f u n c t i o n ( o b j e c t ,   p r i o r i t y )   { 
 
                 c o n t e n t s . p u s h ( { o b j e c t :   o b j e c t ,   p r i o r i t y :   p r i o r i t y } ) ; 
 
                 s o r t e d   =   f a l s e ; 
 
             } , 
 
 
 
             / * * 
 
               *   @ m e m b e r   P r i o r i t y Q u e u e 
 
               *   @ r e t u r n s   t h e   c u r r e n t   n u m b e r   o f   e l e m e n t s   i n   t h e   q u e u e . 
 
               * / 
 
             c l e a r :   f u n c t i o n ( )   { 
 
                 c o n t e n t s   =   [ ] ; 
 
             } 
 
         } ; 
 
 
 
         r e t u r n   s e l f ; 
 
     } ; 
 
 } ) ( ) ; 