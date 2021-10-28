import CCollider from "./CCollider";

export default interface OnContactListener{
    onColliderEnter(other:CCollider,self:CCollider):void;
    onColliderStay(other:CCollider,self:CCollider):void;
    onColliderExit(other:CCollider,self:CCollider):void;
    onColliderPreSolve(other:CCollider,self:CCollider):void;
}