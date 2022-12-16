
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum SelectOptionResult {
    invalidCardCheckResult = "invalidCardCheckResult",
    ycustomerResult = "ycustomerResult",
    branchlockResult = "branchlockResult",
    moneyShortageResult = "moneyShortageResult",
    nisaResult = "nisaResult",
    nameMatchingResult = "nameMatchingResult",
    authSalesResult = "authSalesResult",
    snrfileFundsId = "snrfileFundsId",
    snrfileDepositsId = "snrfileDepositsId"
}

export enum SortOption {
    id = "id",
    creditReservesId = "creditReservesId",
    branchCode = "branchCode",
    accountCode = "accountCode",
    brandCode = "brandCode",
    orderDate = "orderDate",
    orderAmount = "orderAmount",
    accountType = "accountType",
    invalidCardCheckResult = "invalidCardCheckResult",
    ycustomerResult = "ycustomerResult",
    branchlockResult = "branchlockResult",
    moneyShortageResult = "moneyShortageResult",
    nisaResult = "nisaResult",
    nameMatchingResult = "nameMatchingResult",
    authSalesResult = "authSalesResult",
    snrfileFundsId = "snrfileFundsId",
    snrfileDepositsId = "snrfileDepositsId",
    notTarget = "notTarget"
}

export enum SortType {
    ASC = "ASC",
    DESC = "DESC"
}

export enum ProcessStatus {
    HEALTHY = "HEALTHY",
    IN_PROCESS = "IN_PROCESS"
}

export interface LoginInput {
    email: string;
    password: string;
    grantType?: Nullable<string>;
}

export interface AddUserInput {
    email: string;
    password: string;
}

export interface ChangePasswordInput {
    password?: Nullable<string>;
    newPassword?: Nullable<string>;
}

export interface IntputGetOrderByDate {
    orderDate: Date;
    getAll?: Nullable<boolean>;
    sortOption?: Nullable<SortOption>;
    sortType?: Nullable<SortType>;
    page: number;
    pageSize: number;
}

export interface InputResetOrder {
    orderDate: Date;
}

export interface InputUpateStep {
    orderDate: Date;
    step: number;
}

export interface InputCheckResult {
    orderDate: Date;
}

export interface InputChangeOrderDate {
    orderDate: Date;
    newOrderDate: Date;
}

export interface InputCheckResults {
    orderDate?: Nullable<Date>;
    rejects?: Nullable<Nullable<number>[]>;
}

export interface InputInsertData {
    orderDate: Date;
    amount?: Nullable<number>;
    setupData?: Nullable<boolean>;
}

export interface InputInsertDataReserver {
    amount?: Nullable<number>;
}

export interface GmoData {
    orderDate: Date;
    file: FileUpload;
}

export interface GmoItemInput {
    orderId: string;
    memberId: string;
    errorCode?: Nullable<string>;
    errorCodeDetail?: Nullable<string>;
    statusCode: string;
}

export interface InputCreditOrder {
    orderDate: Date;
}

export interface IQuery {
    login(input: LoginInput): Nullable<LoginResponse> | Promise<Nullable<LoginResponse>>;
    logout(): Nullable<LogoutResponse> | Promise<Nullable<LogoutResponse>>;
    refreshToken(refreshToken?: Nullable<string>): Nullable<RefreshTokenQueryResponse> | Promise<Nullable<RefreshTokenQueryResponse>>;
    getOrderList(page?: Nullable<number>, pageSize?: Nullable<number>): Nullable<GetOrderListRespone> | Promise<Nullable<GetOrderListRespone>>;
    getOrdersByDate(input: IntputGetOrderByDate): Nullable<GetCreditReserveOrderByStepResponse> | Promise<Nullable<GetCreditReserveOrderByStepResponse>>;
    createCreditReserve(): Nullable<number> | Promise<Nullable<number>>;
    getGmoData(input: InputCreditOrder): Nullable<GmoDataResponse> | Promise<Nullable<GmoDataResponse>>;
}

export interface LoginResponse {
    statusCode: number;
    data?: Nullable<Login>;
    error?: Nullable<Error>;
}

export interface Login {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    tokenType: string;
    role: number;
}

export interface RefreshTokenQueryResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<AccessToken>;
    error?: Nullable<Error>;
}

export interface IMutation {
    changePassword(changePassword?: Nullable<ChangePasswordInput>): Nullable<ChangePasswordResponse> | Promise<Nullable<ChangePasswordResponse>>;
    addUser(input: AddUserInput): Nullable<MutationResponse> | Promise<Nullable<MutationResponse>>;
    createOrderListToSNR(input: InputCreditOrder): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    resetOrder(input: InputResetOrder): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    resetOrderAll(input: InputResetOrder): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    removeSnrRecord(input: InputResetOrder): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    insertData(input: InputInsertData): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    insertReserver(input: InputInsertDataReserver): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    handleCheckResults(input?: Nullable<InputCheckResults>): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    createPaymentsToSnr(orderDate?: Nullable<Date>): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    changeOrderDate(input: InputChangeOrderDate): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
    updateStep(input: InputUpateStep): Nullable<UpdateStepResponse> | Promise<Nullable<UpdateStepResponse>>;
    updateResultStep(input: InputCheckResult): Nullable<UpdateStepResponse> | Promise<Nullable<UpdateStepResponse>>;
    updateGmoData(gmoData: GmoData): Nullable<GetCreditReserveOrderResponse> | Promise<Nullable<GetCreditReserveOrderResponse>>;
}

export interface ChangePasswordResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<ChangePassword>;
    error?: Nullable<Error>;
}

export interface ChangePassword {
    userId?: Nullable<number>;
}

export interface AccessToken {
    accessToken?: Nullable<string>;
    expiredAt?: Nullable<number>;
}

export interface RefreshToken {
    refreshToken?: Nullable<string>;
    expiredAt?: Nullable<number>;
}

export interface LogoutResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    error?: Nullable<Error>;
    data?: Nullable<Logout>;
}

export interface Logout {
    userId?: Nullable<number>;
}

export interface OrderDetail {
    day?: Nullable<number>;
    isActive?: Nullable<boolean>;
    month?: Nullable<number>;
}

export interface Orders {
    orderDetail?: Nullable<Nullable<OrderDetail>[]>;
    no?: Nullable<number>;
    month?: Nullable<number>;
    year?: Nullable<number>;
}

export interface OrdersRespone {
    items?: Nullable<Nullable<Orders>[]>;
    pagination?: Nullable<PagerInformation>;
}

export interface GetOrderListRespone {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<OrdersRespone>;
    error?: Nullable<Error>;
}

export interface CreditReserveOrderByStep {
    status?: Nullable<string>;
    items?: Nullable<Nullable<CreditReserveOrder>[]>;
    step?: Nullable<number>;
    statusStep?: Nullable<string>;
    pagination?: Nullable<PagerInformation>;
    allNull?: Nullable<boolean>;
}

export interface GetCreditReserveOrderByStepResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<CreditReserveOrderByStep>;
    error?: Nullable<Error>;
}

export interface ResetDataResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    error?: Nullable<Error>;
}

export interface GmoDataResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<Nullable<GmoItem>[]>;
    error?: Nullable<Error>;
}

export interface GmoItem {
    shopId?: Nullable<string>;
    orderId?: Nullable<string>;
    processingDivision?: Nullable<string>;
    amount?: Nullable<number>;
    paymentMethod?: Nullable<number>;
    memberId?: Nullable<string>;
}

export interface Error {
    errorCode: string;
    message?: Nullable<string>;
    details: Nullable<ErrorDetail>[];
}

export interface ErrorDetail {
    message?: Nullable<string>;
    type?: Nullable<string>;
    key?: Nullable<string>;
    value?: Nullable<string>;
}

export interface PagerInformation {
    pageTotal?: Nullable<number>;
    totalCount?: Nullable<number>;
    currentPage?: Nullable<number>;
    pageSize?: Nullable<number>;
}

export interface MutationResponse {
    statusCode: number;
    data?: Nullable<string>;
    error?: Nullable<Error>;
}

export interface CreditReserveOrder {
    id?: Nullable<number>;
    creditReservesId?: Nullable<number>;
    branchCode?: Nullable<string>;
    accountCode?: Nullable<string>;
    brandCode?: Nullable<string>;
    orderAmount?: Nullable<number>;
    accountType?: Nullable<number>;
    orderDate?: Nullable<Date>;
    invalidCardCheckResult?: Nullable<string>;
    ycustomerResult?: Nullable<string>;
    branchlockResult?: Nullable<string>;
    moneyShortageResult?: Nullable<string>;
    nisaResult?: Nullable<string>;
    nameMatchingResult?: Nullable<string>;
    authSalesResult?: Nullable<string>;
    snrfileFundsId?: Nullable<number>;
    snrfileDepositsId?: Nullable<number>;
    notTarget?: Nullable<string>;
}

export interface StepResponse {
    id?: Nullable<number>;
    currentStep?: Nullable<number>;
    status?: Nullable<string>;
    orderDate?: Nullable<Date>;
}

export interface GetCreditReserveOrderResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    error?: Nullable<Error>;
}

export interface UpdateStepResponse {
    statusCode?: Nullable<number>;
    message?: Nullable<string>;
    data?: Nullable<string>;
    error?: Nullable<Error>;
}

export type Int64 = any;
export type FileUpload = any;
export type JSON = any;
type Nullable<T> = T | null;
