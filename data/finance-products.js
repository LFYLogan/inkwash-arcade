/* 产品目录：案例里推荐的候选产品都从这里取。
 * 追加方式：在数组末尾加一条，字段齐全即可，页面会自动读到。
 *   id    唯一标识（案例里引用它）
 *   name  产品名
 *   type  类型（存款/理财/基金/保险/私募…）
 *   risk  风险等级 R1-R5
 *   term  期限描述
 *   liq   流动性描述
 *   min   起投门槛
 *   note  一句话说明（面向从业者的风险点）
 */
window.FINANCE_PRODUCTS = [
  { id: 'p_deposit',   name: '大额存单（3 年）',        type: '存款', risk: 'R1', term: '3 年',        liq: '可提前支取，按活期计息，损失利息', min: '20 万元起',  note: '存款保险 50 万元以内本息受偿，超出的部分要看机构风险' },
  { id: 'p_mmf',       name: '货币市场基金',            type: '基金', risk: 'R1', term: '无固定期限',   liq: 'T+1 赎回，部分支持快速赎回',       min: '1 元起',     note: '不保本，七日年化只是短期指标' },
  { id: 'p_shortbond', name: '短债基金',                type: '基金', risk: 'R2', term: '建议持有 3 个月以上', liq: '随时赎回，T+1/T+2 到账',     min: '1 元起',     note: '净值型，短期可能小幅回撤' },
  { id: 'p_struct',    name: '结构性存款（90 天）',     type: '存款', risk: 'R1', term: '90 天封闭',   liq: '封闭期内不可赎回',                min: '1 万元起',   note: '保本但不保收益，收益取决于挂钩标的' },
  { id: 'p_bankwm',    name: '固收类银行理财（净值型）', type: '理财', risk: 'R2', term: '6–12 个月',  liq: '多数有封闭期或最短持有期',        min: '1 万元起',   note: '资管新规后不再保本保收益，会浮亏' },
  { id: 'p_bondfund',  name: '纯债基金',                type: '基金', risk: 'R2', term: '建议 1 年以上', liq: 'T+1 起赎回',                      min: '10 元起',    note: '利率上行时净值会跌，久期越长跌得越多' },
  { id: 'p_mixed',     name: '偏债混合基金',            type: '基金', risk: 'R3', term: '建议 2–3 年', liq: 'T+1 起赎回',                       min: '10 元起',    note: '含权益仓位，波动大于纯债' },
  { id: 'p_annuity',   name: '年金保险（10 年期）',      type: '保险', risk: 'R2', term: '10 年以上',   liq: '前期退保损失本金，流动性差',      min: '1 万元起',   note: '长期锁定期，销售时不得与存款、理财混淆' },
  { id: 'p_index',     name: '宽基指数基金',            type: '基金', risk: 'R4', term: '建议 3 年以上', liq: 'T+1 起赎回',                      min: '10 元起',    note: '波动大，短期可能深度回撤' },
  { id: 'p_stockfund', name: '主动权益基金',            type: '基金', risk: 'R4', term: '建议 3–5 年', liq: 'T+1 起赎回',                       min: '10 元起',    note: '依赖基金经理，历史业绩不代表未来' },
  { id: 'p_qdii',      name: 'QDII 海外权益基金',        type: '基金', risk: 'R4', term: '建议 3 年以上', liq: 'T+2 起赎回，可能限购',            min: '100 元起',   note: '叠加汇率风险与境外市场风险' },
  { id: 'p_priv',      name: '私募证券基金',            type: '私募', risk: 'R5', term: '封闭 3 年',    liq: '封闭期内不可赎回',                min: '100 万元起', note: '仅限合格投资者，不得公开宣传' },
  { id: 'p_gold',      name: '黄金 ETF',                type: '基金', risk: 'R3', term: '无固定期限',   liq: 'T+1 起赎回',                      min: '100 元起',   note: '无息资产，价格受实际利率与避险情绪影响' },
  { id: 'p_reits',     name: '公募 REITs',              type: '基金', risk: 'R4', term: '长期持有',     liq: '场内交易，可能折价',              min: '100 份起',   note: '底层是不动产，价格会波动，不是固定收益' }
];
window.FINANCE_META = { version: '2.0', products: window.FINANCE_PRODUCTS.length };